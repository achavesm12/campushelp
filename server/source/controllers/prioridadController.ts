import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '../../generated/prisma';

export class PrioridadController {
    private prisma = new PrismaClient();

    // Obtener todas las prioridades
    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const prioridades = await this.prisma.prioridad.findMany({
                orderBy: { id: 'asc' },
            });

            res.json(prioridades);
        } catch (error) {
            console.error('Error obteniendo las prioridades:', error);
            res.status(500).json({ message: 'Error al obtener las prioridades' });
        }
    };

    // Obtener prioridad por ID
    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);

            const prioridad = await this.prisma.prioridad.findUnique({
                where: { id },
            });

            if (!prioridad) {
                return res.status(404).json({ message: 'Prioridad no encontrada' });
            }

            res.json(prioridad);
        } catch (error) {
            console.error('Error obteniendo la prioridad:', error);
            res.status(500).json({ message: 'Error al obtener la prioridad' });
        }
    };
}
