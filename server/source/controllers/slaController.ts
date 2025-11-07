import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '../../generated/prisma';

export class SlaController {
    private prisma = new PrismaClient();

    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const slas = await this.prisma.sLA.findMany({
                orderBy: { id: 'asc' },
            });
            res.json(slas);
        } catch (error) {
            console.error('Error obteniendo los SLA:', error);
            res.status(500).json({ message: 'Error al obtener los SLA' });
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            const sla = await this.prisma.sLA.findUnique({ where: { id } });

            if (!sla) return res.status(404).json({ message: 'SLA no encontrado' });

            res.json(sla);
        } catch (error) {
            console.error('Error obteniendo el SLA:', error);
            res.status(500).json({ message: 'Error al obtener el SLA' });
        }
    };
}
