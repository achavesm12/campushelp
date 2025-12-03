import { Request, Response, NextFunction } from "express";
import { PrismaClient, NotificationType } from "../../generated/prisma";
import { addHours, differenceInHours, format } from "date-fns";
import { es } from "date-fns/locale";

export class AsignacionController {
    prisma = new PrismaClient();

    // ============================================================
    // 📌 1. LISTADO DE ASIGNACIONES (para módulo de Asignaciones)
    // ============================================================
    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const asignaciones = await this.prisma.asignacion.findMany({
                include: {
                    ticket: {
                        include: {
                            categoria: { include: { sla: true } }
                        }
                    },
                    usuario: true
                },
                orderBy: { createdAt: "asc" }
            });

            const resultado = asignaciones.map((a) => {
                const ticket = a.ticket;
                const categoria = ticket.categoria;

                const fechaLimite = addHours(ticket.createdAt, categoria.sla.maxResolucionHrs);
                const horasRestantes = differenceInHours(fechaLimite, new Date());

                return {
                    id: ticket.id,
                    titulo: ticket.titulo,
                    categoria: categoria.nombre,
                    estado: ticket.status,
                    tecnico: a.usuario.nombre,
                    dia: format(a.createdAt, "EEEE", { locale: es }),
                    slaRestanteHoras: horasRestantes,
                    fechaAsignacion: a.createdAt
                };
            });

            res.status(200).json(resultado);
        } catch (err) {
            next(err);
        }
    };



    // ============================================================
    // 📌 2. OBTENER TÉCNICOS DISPONIBLES PARA ASIGNACIÓN MANUAL
    // ============================================================
    getTecnicosDisponibles = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const idTicket = Number(req.params.idTicket);
            if (isNaN(idTicket)) return res.status(400).json({ message: "ID inválido" });

            const ticket = await this.prisma.ticket.findUnique({
                where: { id: idTicket },
                include: {
                    categoria: { include: { sla: true, especialidades: true } },
                    prioridad: true,
                    solicitante: true
                }
            });

            if (!ticket) return res.status(404).json({ message: "Ticket no encontrado" });

            if (ticket.status !== "PENDING") {
                return res.status(400).json({
                    message: "Solo se pueden asignar tickets en estado 'PENDING'"
                });
            }

            const { horasRestantes } = this.calcularSLARestante(ticket);

            const especialidadesRequeridas = ticket.categoria.especialidades.map(e => e.id);

            const tecnicos = await this.prisma.usuario.findMany({
                where: {
                    role: "TECH",
                    disponibilidad: true
                },
                include: {
                    especialidades: true,
                    asignaciones: {
                        include: { ticket: true }
                    }
                }
            });

            const lista = tecnicos.map(t => {
                const especialidadesTecnico = t.especialidades.map(e => e.id);

                return {
                    id: t.id,
                    nombre: t.nombre,
                    disponibilidad: t.disponibilidad,
                    especialidades: t.especialidades,
                    carga: t.asignaciones.filter(a => a.ticket.status !== "CLOSED").length,
                    cumpleEspecialidad: especialidadesTecnico.some(e =>
                        especialidadesRequeridas.includes(e)
                    )
                };
            });

            res.status(200).json({
                ticket: {
                    id: ticket.id,
                    titulo: ticket.titulo,
                    categoria: ticket.categoria.nombre,
                    prioridad: ticket.prioridad.nombre,
                    slaResolucion: ticket.categoria.sla.maxResolucionHrs,
                    horasRestantes
                },
                tecnicos: lista
            });

        } catch (err) {
            next(err);
        }
    };



    // ============================================================
    // 📌 3. ASIGNACIÓN MANUAL
    // ============================================================
    asignacionManual = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { ticketId, tecnicoId, justificacion } = req.body;

            if (!ticketId || !tecnicoId || !justificacion) {
                return res.status(400).json({ message: "Datos incompletos" });
            }

            const ticket = await this.prisma.ticket.findUnique({
                where: { id: ticketId },
                include: {
                    categoria: { include: { especialidades: true } },
                    asignacion: true,
                    solicitante: true
                }
            });

            if (!ticket) return res.status(404).json({ message: "Ticket no encontrado" });

            if (ticket.status !== "PENDING") {
                return res.status(400).json({ message: "Solo tickets PENDING pueden asignarse" });
            }

            if (ticket.asignacion) {
                return res.status(400).json({ message: "El ticket ya tiene asignación" });
            }

            const tecnico = await this.prisma.usuario.findUnique({
                where: { id: tecnicoId },
                include: { especialidades: true }
            });

            if (!tecnico || tecnico.role !== "TECH") {
                return res.status(400).json({ message: "Técnico inválido" });
            }

            const especialidadesCategoria = ticket.categoria.especialidades.map(e => e.id);
            const espTecnico = tecnico.especialidades.map(e => e.id);

            const cumple = espTecnico.some(e => especialidadesCategoria.includes(e));

            if (!cumple) {
                return res.status(400).json({
                    message: "El técnico no posee la especialidad requerida"
                });
            }

            // === CREAR ASIGNACIÓN ===
            await this.prisma.asignacion.create({
                data: {
                    ticketId,
                    usuarioId: tecnicoId,
                    metodo: "MANUAL",
                    justificacion
                }
            });

            // === ACTUALIZAR ESTADO ===
            await this.prisma.ticket.update({
                where: { id: ticketId },
                data: { status: "ASSIGNED" }
            });

            // === 🔔 NOTIFICACIONES (adaptadas a tu modelo) ===
            await this.prisma.notificacion.createMany({
                data: [
                    {
                        usuarioId: tecnicoId,
                        actorId: req.user!.id,
                        ticketId: ticket.id,
                        tipo: NotificationType.TICKET_ASSIGNED,
                        mensaje: `Se le asignó manualmente el ticket #${ticket.id}`,
                        descripcion: `Asignación realizada por usuario ${req.user!.id}`
                    },
                    {
                        usuarioId: ticket.solicitanteId,
                        actorId: req.user!.id,
                        ticketId: ticket.id,
                        tipo: NotificationType.TICKET_ASSIGNED,
                        mensaje: `Su ticket #${ticket.id} fue asignado al técnico ${tecnico.nombre}`,
                        descripcion: `Asignado manualmente por usuario ${req.user!.id}`
                    }
                ]
            });

            res.status(201).json({
                message: "Asignación manual registrada correctamente",
                ticketId,
                tecnico: tecnico.nombre
            });

        } catch (err) {
            next(err);
        }
    };



    // ============================================================
    // 📌 4. ASIGNACIÓN AUTOMÁTICA (AUTOTRIAGE)
    // ============================================================
    asignacionAutomatica = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const pendientes = await this.prisma.ticket.findMany({
                where: {
                    status: "PENDING",
                    asignacion: { is: null }
                },
                include: {
                    categoria: {
                        include: {
                            sla: true,
                            especialidades: true
                        }
                    },
                    prioridad: true,
                    solicitante: true
                }
            });

            if (pendientes.length === 0) {
                return response.status(200).json({
                    message: "No hay tickets pendientes para asignar",
                    resultados: []
                });
            }

            const resultados: any[] = [];

            for (const ticket of pendientes) {

                // SLA
                const fechaCreacion = ticket.createdAt;
                const slaHoras = ticket.categoria.sla.maxResolucionHrs;
                const horasRestantes = Math.ceil(
                    (new Date(fechaCreacion).getTime() + slaHoras * 3600000 - Date.now()) / 3600000
                );

                // Prioridad en número
                const prioridadValor = (() => {
                    const p = ticket.prioridad.nombre.toLowerCase();
                    if (p.includes("alta")) return 3;
                    if (p.includes("media")) return 2;
                    return 1;
                })();

                const puntaje = prioridadValor * 1000 - horasRestantes;

                // Técnicos válidos
                const tecnicos = await this.prisma.usuario.findMany({
                    where: { role: "TECH" },
                    include: {
                        especialidades: true,
                        asignaciones: { include: { ticket: true } }
                    }
                });

                const especialidadesRequeridas = ticket.categoria.especialidades.map(e => e.id);

                const tecnicosValidos = tecnicos.filter(t =>
                    t.especialidades.some(esp => especialidadesRequeridas.includes(esp.id))
                );

                if (tecnicosValidos.length === 0) {
                    resultados.push({
                        ticketId: ticket.id,
                        estado: "SIN_TECNICO",
                        mensaje: "Ningún técnico tiene la especialidad requerida",
                        puntaje
                    });
                    continue;
                }

                const tecnicosConCarga = tecnicosValidos.map(t => ({
                    ...t,
                    carga: t.asignaciones.filter(a => a.ticket.status !== "CLOSED").length
                }));

                const tecnicoElegido = tecnicosConCarga.sort(
                    (a, b) => a.carga - b.carga
                )[0];

                // Crear asignación
                await this.prisma.asignacion.create({
                    data: {
                        ticketId: ticket.id,
                        usuarioId: tecnicoElegido.id,
                        metodo: "AUTOMATICO",
                        justificacion: `Asignado automáticamente. Puntaje ${puntaje}. Técnico con menor carga.`
                    }
                });

                // Cambiar estado
                await this.prisma.ticket.update({
                    where: { id: ticket.id },
                    data: { status: "ASSIGNED" }
                });

                // 🔔 NOTIFICACIONES (adaptadas a tu modelo)
                await this.prisma.notificacion.createMany({
                    data: [
                        {
                            usuarioId: tecnicoElegido.id,
                            actorId: request.user!.id,
                            ticketId: ticket.id,
                            tipo: NotificationType.TICKET_ASSIGNED,
                            mensaje: `Se le asignó automáticamente el ticket #${ticket.id}`,
                            descripcion: `Autotriage realizado por usuario ${request.user!.id}`
                        },
                        {
                            usuarioId: ticket.solicitanteId,
                            actorId: request.user!.id,
                            ticketId: ticket.id,
                            tipo: NotificationType.TICKET_ASSIGNED,
                            mensaje: `Su ticket #${ticket.id} fue asignado automáticamente al técnico ${tecnicoElegido.nombre}`,
                            descripcion: `Autotriage realizado por usuario ${request.user!.id}`
                        }
                    ]
                });

                resultados.push({
                    ticketId: ticket.id,
                    tecnico: tecnicoElegido.nombre,
                    cargaActual: tecnicoElegido.carga,
                    especialidades: tecnicoElegido.especialidades.map(e => e.nombre),
                    horasRestantes,
                    prioridad: ticket.prioridad.nombre,
                    puntaje,
                    justificacion: `Asignado automáticamente por puntaje ${puntaje}.`
                });
            }

            return response.status(200).json({
                message: "Asignación automática completada",
                resultados
            });

        } catch (error) {
            next(error);
        }
    };




    // ============================================================
    // 📌 MÉTODOS AUXILIARES
    // ============================================================

    private calcularSLARestante(ticket: any) {
        const horasSLA = ticket.categoria.sla.maxResolucionHrs;
        const fechaLimite = new Date(ticket.createdAt.getTime() + horasSLA * 3600000);
        const ahora = new Date();
        const horasRestantes = Math.ceil((fechaLimite.getTime() - ahora.getTime()) / 3600000);

        return { horasRestantes, fechaLimite };
    }

    private async obtenerTecnicoIdeal(ticket: any) {
        const especialidadesCategoria = ticket.categoria.especialidades.map((e: any) => e.id);

        if (especialidadesCategoria.length === 0) return null;

        const tecnicos = await this.prisma.usuario.findMany({
            where: {
                role: "TECH",
                disponibilidad: true,
                especialidades: {
                    some: { id: { in: especialidadesCategoria } }
                }
            },
            include: {
                asignaciones: { include: { ticket: true } },
                especialidades: true
            }
        });

        if (tecnicos.length === 0) return null;

        const ordenados = tecnicos.sort(
            (a, b) =>
                a.asignaciones.filter(a => a.ticket.status !== "CLOSED").length -
                b.asignaciones.filter(b2 => b2.ticket.status !== "CLOSED").length
        );

        return ordenados[0];
    }



    // ============================================================
    // 📌 5. VISUAL PARA AVANCE 3
    // ============================================================
    getVisual = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const asignaciones = await this.prisma.asignacion.findMany({
                include: {
                    ticket: {
                        include: {
                            categoria: { include: { sla: true } }
                        }
                    },
                    usuario: true
                },
                orderBy: { createdAt: "asc" }
            });

            const resultado = asignaciones.map((a) => ({
                id: a.ticket.id,
                titulo: a.ticket.titulo,
                categoria: a.ticket.categoria.nombre,
                estado: a.ticket.status,
                tecnico: a.usuario.nombre,
                slaRestanteHoras:
                    a.ticket.categoria.sla.maxResolucionHrs -
                    Math.ceil((Date.now() - a.ticket.createdAt.getTime()) / 3600000),
                dia: a.createdAt.toLocaleDateString("es-CR", { weekday: "long" }),
            }));

            res.status(200).json(resultado);
        } catch (error) {
            next(error);
        }
    };

}
