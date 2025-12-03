import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export class NotificacionController {

    // 📌 Listar todas las notificaciones del usuario logueado
    listar = async (req: any, res: Response) => {
        try {
            const usuarioId = req.user.id; // viene del middleware

            const data = await prisma.notificacion.findMany({
                where: { usuarioId },
                orderBy: { createdAt: "desc" }
            });

            res.json(data);

        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    // 📌 Contar cuántas están sin leer
    contarNoLeidas = async (req: any, res: Response) => {
        try {
            const usuarioId = req.user.id;

            const count = await prisma.notificacion.count({
                where: { usuarioId, leida: false }
            });

            res.json({ count });

        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    // 📌 Marcar una notificación como leída
    marcarComoLeida = async (req: any, res: Response) => {
        try {
            const id = Number(req.params.id);
            const usuarioId = req.user.id;

            const noti = await prisma.notificacion.findUnique({
                where: { id }
            });

            if (!noti) {
                return res.status(404).json({ error: "Notificación no encontrada" });
            }

            if (noti.usuarioId !== usuarioId) {
                return res.status(401).json({ error: "No autorizado" });
            }

            const updated = await prisma.notificacion.update({
                where: { id },
                data: { leida: true }
            });

            res.json(updated);

        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}
