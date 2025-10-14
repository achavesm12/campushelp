import { Request, Response, NextFunction } from "express";
import { PrismaClient, Role } from "../../generated/prisma";
import { AppError } from "../errors/custom.error";
import { join } from "../../generated/prisma/runtime/library";

export class TicketController {
    prisma = new PrismaClient();

    get = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const idUsuario = parseInt(request.query.idUsuario as string) || 1;
            const role = (request.query.role as Role) || Role.ADMIN;
            let tickets;

            //Filtro según el rol
            if (role === Role.ADMIN) { //el admin ve todos los tickets
                tickets = await this.prisma.ticket.findMany({
                    select: {
                        id: true,
                        titulo: true,
                        status: true,
                        categoria: {
                            select: {
                                nombre: true
                            }
                        },
                        solicitante: {
                            select: {
                                nombre: true
                            }
                        },
                    },
                    orderBy: {
                        id: "asc"
                    },
                });
            } else if (role === Role.CLIENT) { //solo los creados por él
                tickets = await this.prisma.ticket.findMany({
                    where: {
                        solicitanteId: idUsuario
                    },
                    select: {
                        id: true,
                        titulo: true,
                        status: true,
                        categoria: {
                            select: {
                                nombre: true
                            }
                        },
                    },
                    orderBy: {
                        id: "asc"
                    },
                });

            } else if (role === Role.TECH) {
                tickets = await this.prisma.ticket.findMany({
                    where: {
                        asignacion: {
                            usuarioId: idUsuario
                        }
                    },
                    select: {
                        id: true,
                        titulo: true,
                        status: true,
                        categoria: {
                            select: {
                                nombre: true
                            }
                        },
                        solicitante: {
                            select: {
                                nombre: true
                            }
                        },
                    },
                    orderBy: { id: "asc" },
                });
            } else {
                return next(AppError.badRequest("Rol inválido"));
            }

            response.status(200).json(tickets);
        }
        catch (error) {
            next(error)
        }
    }

    getById = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const idTicket = parseInt(request.params.id);
            if (isNaN(idTicket)) {
                return next(AppError.badRequest("El ID no es válido"));
            }

            const tickets = await this.prisma.ticket.findFirst({
                where: { id: idTicket },
                include: {
                    solicitante: true,
                    categoria: {
                        include: {
                            sla: true
                        }
                    },
                    historial: {
                        include: {
                            imagenes: true,
                            actor: true
                        },
                        orderBy: {
                            createdAt: 'asc'
                        }
                    },
                    valoracion: true,
                    asignacion: {
                        include: {
                            usuario: true
                        }
                    }
                }
            });

            if (!tickets) {
                return next(AppError.notFound("Ticket no encontrado"));
            }
            //**valores calculados**
            //fecha creación del ticket
            const fechaCreacion = tickets.createdAt;

            //fecha cierre del ticket
            const fechaCierre = tickets.closedAt || new Date();

            //**calculo de días de resolución**
            /*se convierte en días dividiendo
            resta de fechas en milisegundos:
            1000 milisegundos, 60 segundos en un minuto, 60 minutos en una hora, 24 horas en un día*/
            //math.ceil redondea para arriba
            const diasResolucion = Math.ceil((fechaCierre.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24));

            //sla de respuesta y resolución de categoría 
            //si no hay un sla definido, se usan valores por defecto
            const slaRespuestaHoras = tickets.categoria?.sla?.maxRespuestaHrs || 24;
            const slaResolucionHoras = tickets.categoria?.sla?.maxResolucionHrs || 72;

            //calculo de fechas límite según sla
            //se convierte horas a milisegundos
            const fechaLimiteRespuesta = new Date(fechaCreacion.getTime() + slaRespuestaHoras * 60 * 60 * 1000);
            const fechaLimiteResolucion = new Date(fechaCreacion.getTime() + slaResolucionHoras * 60 * 60 * 1000);

            //primer historial del ticket (calcula la primera respuesta)
            const fechaPrimerRespuesta = tickets.historial?.[0]?.createdAt;

            //verificar que la primera respuesta llegó a tiempo según el sla
            const cumplioRespuesta = fechaPrimerRespuesta ? fechaPrimerRespuesta <= fechaLimiteRespuesta : false;

            //verificar si el ticket se cerró a tiempo según el sla
            const cumplioResolucion = tickets.closedAt ? tickets.closedAt <= fechaLimiteResolucion : false;

            // objeto con todos los campos
            const ticketDetalle = {
                ...tickets,                 //todos los datos originales del ticket
                diasResolucion,             //días que tardó en cerrarse
                fechaLimiteRespuesta,       //fecha límite para la primera respuesta
                fechaLimiteResolucion,      //fecha límite para la resolución
                cumplioRespuesta,           //booleano si la primera respuesta fue a tiempo
                cumplioResolucion           //booleano si el ticket se cerró a tiempo
            };

            return response.status(200).json({ data: ticketDetalle });
        }
        catch (error) {
            next(error);
        }
    }
}