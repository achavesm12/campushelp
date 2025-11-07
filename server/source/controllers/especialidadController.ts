import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

export class EspecialidadController {
    // GET /especialidad
    async get(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await prisma.especialidad.findMany();
            res.status(200).json(data);
        } catch (error) {
            console.error('Error al obtener especialidades:', error);
            next(error);
        }
    }

    // GET /especialidad/:id
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const especialidad = await prisma.especialidad.findUnique({
                where: { id },
            });
            if (!especialidad) {
                return res.status(404).json({ message: 'Especialidad no encontrada' });
            }
            res.status(200).json(especialidad);
        } catch (error) {
            console.error('Error al obtener especialidad por ID:', error);
            next(error);
        }
    }
}
