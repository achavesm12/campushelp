import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '../../generated/prisma';

export class EtiquetaController {
    private prisma = new PrismaClient();

    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const etiquetas = await this.prisma.etiqueta.findMany({
                orderBy: { nombre: 'asc' },
            });
            res.json(etiquetas);
        } catch (error) {
            console.error('Error obteniendo etiquetas:', error);
            res.status(500).json({ message: 'Error al obtener etiquetas' });
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            const etiqueta = await this.prisma.etiqueta.findUnique({ where: { id } });

            if (!etiqueta) return res.status(404).json({ message: 'Etiqueta no encontrada' });

            res.json(etiqueta);
        } catch (error) {
            console.error('Error obteniendo la etiqueta:', error);
            res.status(500).json({ message: 'Error al obtener la etiqueta' });
        }
    };
}
