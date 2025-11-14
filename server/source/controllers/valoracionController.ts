import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";
import { AppError } from "../errors/custom.error";

export class ValoracionController {
    prisma = new PrismaClient();

    // Obtener valoración por ID de ticket
    getByTicket = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const idTicket = parseInt(request.params.id);
            if (isNaN(idTicket)) {
                return next(AppError.badRequest("El ID del ticket no es válido"));
            }

            const valoracion = await this.prisma.valoracion.findFirst({
                where: { ticketId: idTicket },
                include: {
                    usuario: {
                        select: { id: true, nombre: true, email: true },
                    },
                },
            });

            if (!valoracion) {
                return next(AppError.notFound("Valoración no encontrada para este ticket"));
            }

            return response.status(200).json(valoracion);
        } catch (error) {
            next(error);
        }
    };

    // Crear valoración (por si más adelante se requiere)
    create = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { ticketId, usuarioId, puntaje, comentario } = request.body;

            if (!ticketId || !usuarioId || !puntaje) {
                return next(AppError.badRequest("Faltan datos obligatorios"));
            }

            // Validar que el ticket exista y esté cerrado
            const ticket = await this.prisma.ticket.findUnique({
                where: { id: ticketId },
            });

            if (!ticket) {
                return next(AppError.notFound("Ticket no encontrado"));
            }

            if (ticket.status !== "CLOSED") {
                return next(AppError.badRequest("Solo se pueden valorar tickets cerrados"));
            }

            // Verificar que no exista ya una valoración
            const existente = await this.prisma.valoracion.findUnique({
                where: { ticketId },
            });

            if (existente) {
                return next(AppError.badRequest("Ya existe una valoración para este ticket"));
            }

            const nueva = await this.prisma.valoracion.create({
                data: {
                    ticketId,
                    usuarioId,
                    puntaje,
                    comentario,
                },
            });

            return response.status(201).json(nueva);
        } catch (error) {
            next(error);
        }
    };
}
