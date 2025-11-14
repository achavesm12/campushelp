import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";
import { addHours, differenceInHours, format } from "date-fns";
import { es } from "date-fns/locale"; // si quieres usar días en español

export class AsignacionController {
    prisma = new PrismaClient();

    // Obtener asignaciones de la semana con info de tickets
    get = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const asignaciones = await this.prisma.asignacion.findMany({
                include: {
                    ticket: {
                        include: {
                            categoria: {
                                include: {
                                    sla: true
                                }
                            }
                        }
                    },
                    usuario: true
                },
                orderBy: {
                    createdAt: "asc"
                }
            });

            const resultado = asignaciones.map((a) => {
                const ticket = a.ticket;
                const categoria = ticket.categoria;
                const slaHoras = categoria.sla.maxResolucionHrs;
                const fechaLimite = addHours(ticket.createdAt, slaHoras);
                const horasRestantes = differenceInHours(fechaLimite, new Date());

                return {
                    id: ticket.id,
                    titulo: ticket.titulo,
                    categoria: categoria.nombre,
                    estado: ticket.status,
                    tecnico: a.usuario.nombre,
                    dia: format(a.createdAt, "EEEE", { locale: es }), // lunes, martes, etc.
                    slaRestanteHoras: horasRestantes,
                    fechaAsignacion: a.createdAt
                };
            });

            response.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    };
}
