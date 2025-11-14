import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '../../generated/prisma';

export class UsuarioController {
    private prisma = new PrismaClient();

    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const usuarios = await this.prisma.usuario.findMany({
                orderBy: { nombre: 'asc' },
                select: {
                    id: true,
                    nombre: true,
                    email: true,
                    role: true,
                }
            });
            res.json(usuarios);
        } catch (error) {
            console.error('Error obteniendo usuarios:', error);
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);

            const usuario = await this.prisma.usuario.findUnique({
                where: { id },
                select: {
                    id: true,
                    nombre: true,
                    email: true,
                    role: true,
                },
            });

            if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

            res.json(usuario);
        } catch (error) {
            console.error('Error obteniendo el usuario:', error);
            next(error);
        }
    };
}