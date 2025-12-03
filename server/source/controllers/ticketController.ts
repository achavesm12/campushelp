import { Request, Response, NextFunction } from "express";
import { PrismaClient, Role } from "../../generated/prisma";
import { AppError } from "../errors/custom.error";

import multer from "multer";
import path from "path";

// === MULTER PARA IMÁGENES DE HISTORIAL ===
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../uploads/tickets"));
    },
    filename: function (req, file, cb) {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, unique + "-" + file.originalname.replace(/\s/g, "_"));
    },
});

export const uploadHistorial = multer({ storage });

export class TicketController {
    prisma = new PrismaClient();

    get = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const idUsuario = parseInt(request.query.idUsuario as string) || 1;
            const role = (request.query.role as Role) || Role.ADMIN;
            let tickets;

            if (role === Role.ADMIN) {
                // Todos los tickets
                tickets = await this.prisma.ticket.findMany({
                    select: {
                        id: true,
                        titulo: true,
                        status: true,
                        categoria: { select: { nombre: true } },
                        solicitante: { select: { id: true, nombre: true } },
                    },
                    orderBy: { id: 'asc' },
                });

            } else if (role === Role.CLIENT) {
                // Solo los creados por este usuario
                tickets = await this.prisma.ticket.findMany({
                    where: { solicitanteId: idUsuario },
                    select: {
                        id: true,
                        titulo: true,
                        status: true,
                        categoria: { select: { nombre: true } },
                        solicitante: { select: { id: true, nombre: true } },
                    },
                    orderBy: { id: 'asc' },
                });

            } else if (role === Role.TECH) {
                // Buscar asignaciones de este técnico
                const asignaciones = await this.prisma.asignacion.findMany({
                    where: { usuarioId: idUsuario },
                    select: { ticketId: true }
                });

                const ticketIds = asignaciones.map(a => a.ticketId);

                tickets = await this.prisma.ticket.findMany({
                    where: { id: { in: ticketIds } },
                    include: {
                        categoria: { select: { nombre: true } },
                        solicitante: { select: { id: true, nombre: true } },
                        asignacion: { select: { usuarioId: true } }
                    },
                    orderBy: { id: 'asc' }
                });

            } else {
                return next(AppError.badRequest("Rol inválido"));
            }

            return response.status(200).json(tickets);
        } catch (error) {
            next(error);
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
                    solicitante: { select: { id: true, nombre: true } },
                    categoria: {
                        select: {
                            id: true,
                            nombre: true,
                            sla: {
                                select: {
                                    maxRespuestaHrs: true,
                                    maxResolucionHrs: true
                                }
                            }
                        }
                    },
                    historial: {
                        select: {
                            id: true,
                            fromStatus: true,
                            toStatus: true,
                            nota: true,
                            createdAt: true,
                            imagenes: true,
                            actor: {
                                select: {
                                    id: true,
                                    nombre: true
                                }
                            },
                        },
                        orderBy: {
                            createdAt: 'asc'
                        }
                    },
                    valoracion: {
                        select: {
                            puntaje: true,
                            comentario: true
                        }
                    },
                    asignacion: {
                        select: {
                            usuario: {
                                select: {
                                    id: true,
                                    nombre: true
                                }
                            }
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
            const cumplioRespuesta = fechaPrimerRespuesta ? fechaPrimerRespuesta <= fechaLimiteRespuesta : null;

            //verificar si el ticket se cerró a tiempo según el sla
            const cumplioResolucion = tickets.closedAt ? tickets.closedAt <= fechaLimiteResolucion : null;

            console.log('DEBUG SLA');
            console.log('Título:', tickets.titulo);
            console.log('Estado:', tickets.status);
            console.log('Fecha creación:', fechaCreacion);
            console.log('Fecha cierre:', fechaCierre);
            console.log('Fecha límite respuesta:', fechaLimiteRespuesta);
            console.log('Fecha límite resolución:', fechaLimiteResolucion);
            console.log('Fecha primer respuesta:', fechaPrimerRespuesta);
            console.log('Cumplió respuesta:', cumplioRespuesta);
            console.log('Cumplió resolución:', cumplioResolucion);
            console.log('====================');


            // objeto con todos los campos
            const ticketDetalle = {
                ...tickets,                 //todos los datos originales del ticket
                diasResolucion,             //días que tardó en cerrarse
                fechaLimiteRespuesta,       //fecha límite para la primera respuesta
                fechaLimiteResolucion,      //fecha límite para la resolución
                cumplioRespuesta,           //booleano si la primera respuesta fue a tiempo
                cumplioResolucion           //booleano si el ticket se cerró a tiempo
            };

            return response.status(200).json(ticketDetalle);
        }
        catch (error) {
            next(error);
        }
    };

    create = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const body = request.body;

            const { titulo, descripcion, prioridadId, etiquetaId, solicitanteId } = body;

            //validaciones

            //validación prioridad
            const prioridad = await this.prisma.prioridad.findUnique({
                where: { id: prioridadId },
            });

            if (!prioridad) {
                return response.status(400).json({ message: "Error con la prioridad" });
            }

            //obtener etiqueta y categoría
            const etiqueta = await this.prisma.etiqueta.findUnique({
                where: { id: etiquetaId },
                include: {
                    categorias: {
                        include: {
                            sla: true
                        }
                    },
                },
            });

            if (!etiqueta) {
                return response.status(400).json({ message: "La etiqueta no existe", });
            }

            if (etiqueta.categorias.length !== 1) {
                return next(AppError.badRequest("La etiqueta debe tener solo una categoría asociada"));
            }

            const categoria = etiqueta.categorias[0];


            //se pide la fecha actual para crear y el calculo automático del sla
            const fechaCreacion = new Date();

            //se obtiene la fecha actual + sla y se * para convertirlos a milisegundos 
            // 3.600.000 milisegundos por hora
            const slaRespuesta = new Date(fechaCreacion.getTime() + categoria.sla.maxRespuestaHrs * 3600000);

            const slaResolucion = new Date(fechaCreacion.getTime() + categoria.sla.maxResolucionHrs * 3600000);

            //Crear ticket
            const newTicket = await this.prisma.ticket.create({
                data: {
                    titulo,
                    descripcion,
                    prioridadId,
                    solicitanteId,
                    categoriaId: categoria.id,
                    status: "PENDING",
                    createdAt: fechaCreacion,
                },
                include: {
                    prioridad: true,
                    categoria: {
                        include: {
                            sla: true
                        }
                    },
                    solicitante: {
                        select: {
                            id: true,
                            nombre: true,
                            email: true
                        }
                    },
                },
            });

            response.status(201).json({
                message: "Ticket creado correctamente", ticket: newTicket,
                calculos: { slaRespuesta, slaResolucion }
            });

        } catch (error: any) {
            console.error("Error creando el ticket ", error);

            if (error.code === "P2002") {
                return response.status(400).json({ message: "Ya existe un registro con ese dato único", });
            }

            response.status(500).json({ message: "Error interno al crear el ticket", details: error.message, });
        }
    };

    updateStatus = async (request: Request, response: Response, next: NextFunction) => {
        try {
            console.log("🔥 updateStatus() ejecutado");

            const ticketId = parseInt(request.params.id);
            if (isNaN(ticketId)) return next(AppError.badRequest("El ID no es válido"));

            const { nuevoEstado, observacion, actorId } = request.body;
            console.log("📥 Datos recibidos:", { nuevoEstado, observacion, actorId });

            if (!nuevoEstado || !observacion || !actorId) {
                return next(AppError.badRequest("Datos requeridos"));
            }

            const imagenes = request.files as Express.Multer.File[];

            // Buscar ticket ORIGINAL (estado viejo)
            const ticket = await this.prisma.ticket.findUnique({
                where: { id: ticketId },
                include: {
                    solicitante: true,
                    asignacion: true
                }
            });

            if (!ticket) {
                return next(AppError.notFound("Ticket no encontrado"));
            }

            console.log("📌 Ticket encontrado:", ticket.status);

            // Validación de transición
            const transicionesValidas: Record<string, string[]> = {
                PENDING: ["ASSIGNED"],
                ASSIGNED: ["IN_PROGRESS"],
                IN_PROGRESS: ["RESOLVED"],
                RESOLVED: ["CLOSED"],
                CLOSED: []
            };

            if (!transicionesValidas[ticket.status].includes(nuevoEstado)) {
                return next(AppError.badRequest(
                    `Transición no permitida: ${ticket.status} → ${nuevoEstado}`
                ));
            }

            if (!imagenes || imagenes.length === 0) {
                return next(AppError.badRequest("Debe adjuntar al menos una imagen"));
            }

            let resultado: any;

            console.log("🔄 Ejecutando transacción…");

            // ============================================================
            // 🔄 TRANSACCIÓN
            // ============================================================
            await this.prisma.$transaction(async (tx) => {

                // 1. Actualizar ticket
                const ticketActualizado = await tx.ticket.update({
                    where: { id: ticketId },
                    data: { status: nuevoEstado }
                });

                // 2. Historial
                const historial = await tx.ticketHistorial.create({
                    data: {
                        ticketId,
                        fromStatus: ticket.status,
                        toStatus: nuevoEstado,
                        nota: observacion,
                        actorId: Number(actorId),
                    }
                });

                // 3. Imágenes
                const imgs = imagenes.map((img) => ({
                    ticketHistorialId: historial.id,
                    url: "/uploads/tickets/" + img.filename
                }));

                await tx.ticketImagen.createMany({ data: imgs });

                console.log("✅ Estado actualizado correctamente:", ticket.status, "→", nuevoEstado);

                // Guardamos el resultado fuera
                resultado = { ticketActualizado, historial, imagenes: imgs };
            });

            // ============================================================
            // 📌 NOTIFICACIONES (POST-TRANSACCIÓN)
            // ============================================================

            const solicitanteId = ticket.solicitanteId;
            const tecnicoId = ticket.asignacion?.usuarioId;

            const estadoAnterior = ticket.status;
            const estadoNuevo = resultado.ticketActualizado.status;

            console.log("📣 Enviando notificaciones…");
            console.log("➡ Solicitante:", solicitanteId);
            console.log("➡ Técnico:", tecnicoId);
            console.log("➡ Estado:", estadoAnterior, "→", estadoNuevo);

            // Notificación para solicitante
            await this.prisma.notificacion.create({
                data: {
                    usuarioId: solicitanteId,
                    tipo: "TICKET_STATUS",
                    mensaje: `El ticket #${ticket.id} cambió de ${estadoAnterior} → ${estadoNuevo}.`,
                    actorId: Number(actorId),
                    ticketId: ticket.id
                }
            });

            // Notificación para el técnico (si hay asignación)
            if (tecnicoId) {
                await this.prisma.notificacion.create({
                    data: {
                        usuarioId: tecnicoId,
                        tipo: "TICKET_STATUS",
                        mensaje: `El ticket #${ticket.id} que tiene asignado cambió a ${estadoNuevo}.`,
                        actorId: Number(actorId),
                        ticketId: ticket.id
                    }
                });
            }

            console.log("✅ Notificaciones enviadas correctamente");

            // ============================================================

            return response.status(200).json({
                message: "Estado del ticket actualizado",
                data: resultado
            });

        } catch (error) {
            console.error("❌ ERROR updateStatus:", error);
            next(error);
        }
    };


}