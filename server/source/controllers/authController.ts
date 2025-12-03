import { Request, Response, NextFunction } from "express";
import { PrismaClient, NotificationType } from "../../generated/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/custom.error";

const prisma = new PrismaClient();

export class AuthController {

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return next(AppError.badRequest("Email y contraseña requeridos"));
            }

            const user = await prisma.usuario.findUnique({ where: { email } });
            if (!user) return next(AppError.badRequest("Credenciales inválidas"));

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) return next(AppError.badRequest("Credenciales inválidas"));

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET || "secreto-super-seguro",
                { expiresIn: "2h" }
            );

            // 🔔 Notificación de login
            await prisma.notificacion.create({
                data: {
                    usuarioId: user.id,
                    actorId: user.id,
                    ticketId: null,
                    tipo: NotificationType.LOGIN,
                    mensaje: "Inicio de sesión exitoso",
                    descripcion: "El usuario accedió al sistema"
                }
            });

            return res.json({
                token,
                usuario: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                    role: user.role
                }
            });

        } catch (error) {
            next(error);
        }
    };

}
