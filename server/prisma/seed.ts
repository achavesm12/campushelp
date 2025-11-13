import { PrismaClient, Role, TicketStatus } from "../generated/prisma";
import { usuarios } from "./seeds/usuarios";
import { especialidades } from "./seeds/especialidades";
import { categorias } from "./seeds/categorias";
import { etiquetas } from "./seeds/etiquetas";
import { slas } from "./seeds/sla";
import { prioridades } from "./seeds/prioridades";

const prisma = new PrismaClient();

const main = async () => {
    try {
        console.log("🌱 Iniciando seed...");

        // Usuarios
        await prisma.usuario.createMany({ data: usuarios, skipDuplicates: true });
        console.log("✅ Usuarios insertados");

        // Especialidades
        await prisma.especialidad.createMany({
            data: especialidades,
            skipDuplicates: true,
        });
        console.log("✅ Especialidades insertadas");

        // SLA
        await prisma.sLA.createMany({ data: slas, skipDuplicates: true });
        console.log("✅ SLA insertados");

        // Etiquetas
        await prisma.etiqueta.createMany({ data: etiquetas, skipDuplicates: true });
        console.log("✅ Etiquetas insertadas");

        // Categorías (solo nombre + slaId)
        await prisma.categoria.createMany({
            data: categorias.map((cat) => ({
                nombre: cat.nombre,
                slaId: cat.slaId,
            })),
            skipDuplicates: true,
        });
        console.log("✅ Categorías insertadas");

        // Relaciones categoría–especialidad–etiqueta
        for (const cat of categorias) {
            await prisma.categoria.update({
                where: { nombre: cat.nombre },
                data: {
                    especialidades: {
                        connect: cat.especialidades.map((e) => ({ id: e.id })),
                    },
                    etiquetas: { connect: cat.etiquetas.map((t) => ({ id: t.id })) },
                },
            });
        }
        console.log("✅ Relaciones de categorías creadas");

        // Asignar especialidades a técnicos
        const tecnicos = [
            { id: 4, especialidades: [1, 2] },
            { id: 5, especialidades: [3] },
            { id: 6, especialidades: [4] },
        ];

        for (const tec of tecnicos) {
            await prisma.usuario.update({
                where: { id: tec.id },
                data: {
                    especialidades: {
                        connect: tec.especialidades.map((id) => ({ id })),
                    },
                },
            });
        }
        console.log("✅ Especialidades asignadas a técnicos");

        // Prioridades
        await prisma.prioridad.createMany({
            data: prioridades,
            skipDuplicates: true,
        });
        console.log("✅ Prioridades insertadas");

        // Tickets
        const tickets = [
            {
                id: 1,
                titulo: "Problema con WiFi",
                descripcion: "El internet se desconecta constantemente",
                solicitanteId: 3,
                categoriaId: 1,
                prioridadId: 3,
                status: TicketStatus.ASSIGNED,
                createdAt: new Date("2025-10-31T09:00:00"),
            },
            {
                id: 2,
                titulo: "Error Office",
                descripcion: "No puedo abrir Microsoft Word",
                solicitanteId: 4,
                categoriaId: 3,
                prioridadId: 2,
                status: TicketStatus.ASSIGNED,
                createdAt: new Date("2025-10-25T08:00:00"),
            },
            {
                id: 3,
                titulo: "Impresora no funciona",
                descripcion: "La impresora del laboratorio no imprime",
                solicitanteId: 5,
                categoriaId: 2,
                prioridadId: 3,
                status: TicketStatus.IN_PROGRESS,
                createdAt: new Date("2025-10-26T08:00:00"),
            },
            {
                id: 4,
                titulo: "Problemas de acceso a correo",
                descripcion: "No puedo ingresar a mi correo institucional",
                solicitanteId: 3,
                categoriaId: 4,
                prioridadId: 4,
                status: TicketStatus.RESOLVED,
                createdAt: new Date("2025-10-27T08:00:00"),
            },
            {
                id: 5,
                titulo: "Solicito acceso al sistema académico",
                descripcion: "No tengo permisos para ingresar",
                solicitanteId: 7,
                categoriaId: 5,
                prioridadId: 1,
                status: TicketStatus.CLOSED,
                createdAt: new Date("2025-10-28T08:00:00"),
                closedAt: new Date("2025-10-28T13:00:00"),
            },
            {
                id: 6,
                titulo: "VPN no se conecta",
                descripcion: "VPN falla actualización",
                solicitanteId: 5,
                categoriaId: 1,
                prioridadId: 2,
                status: TicketStatus.PENDING,
                createdAt: new Date("2025-10-28T14:00:00"),
            },
            {
                id: 7,
                titulo: "Restablecer contraseña",
                descripcion: "No puedo ingresar al sistema y necesito restablecer la clave.",
                solicitanteId: 5,
                categoriaId: 2,
                prioridadId: 1,
                status: TicketStatus.CLOSED,
                createdAt: new Date("2025-10-29T09:00:00"),
                closedAt: new Date("2025-10-29T11:30:00"),
            },
        ];

        for (const t of tickets) await prisma.ticket.create({ data: t });
        console.log("✅ Tickets insertados");

        // Asignaciones
        const asignaciones = [
            {
                ticketId: 1,
                usuarioId: 6,
                metodo: "Manual",
                justificacion: "Asignado como ejemplo adicional",
                createdAt: new Date("2025-10-31T09:00:00Z"),
            },
            {
                ticketId: 2,
                usuarioId: 4,
                metodo: "Manual",
                justificacion: "Asignado a Técnico 1 por administrador",
                createdAt: new Date("2025-10-25T08:00:00Z"),
            },
            {
                ticketId: 3,
                usuarioId: 5,
                metodo: "Automático",
                justificacion: "Asignado automáticamente por disponibilidad",
                createdAt: new Date("2025-10-26T08:00:00Z"),
            },
            {
                ticketId: 4,
                usuarioId: 6,
                metodo: "Manual",
                justificacion: "Asignación manual del coordinador",
                createdAt: new Date("2025-10-27T08:00:00Z"),
            },
            {
                ticketId: 5,
                usuarioId: 4,
                metodo: "Automático",
                justificacion: "Técnico especializado en correo electrónico",
                createdAt: new Date("2025-10-28T08:00:00Z"),
            },
            {
                ticketId: 6,
                usuarioId: 5,
                metodo: "Manual",
                justificacion: "Asignado por experiencia previa",
                createdAt: new Date("2025-10-28T14:00:00Z"),
            },
        ];

        for (const a of asignaciones) await prisma.asignacion.create({ data: a });
        console.log("✅ Asignaciones creadas");

        // Valoraciones
        const valoraciones = [
            {
                ticketId: 5,
                usuarioId: 7,
                puntaje: 5,
                comentario: "Excelente servicio, el técnico fue muy eficiente y amable.",
                createdAt: new Date("2025-10-28T14:00:00"),
                updatedAt: new Date("2025-10-28T14:00:00"),
            },
            {
                ticketId: 7,
                usuarioId: 5,
                puntaje: 3,
                comentario: "El problema se resolvió, pero tomó más tiempo del esperado.",
                createdAt: new Date("2025-10-29T12:00:00"),
                updatedAt: new Date("2025-10-29T12:00:00"),
            },
        ];

        await prisma.valoracion.createMany({ data: valoraciones, skipDuplicates: true });
        console.log("✅ Valoraciones insertadas");

        // Historial con evidencias
        const historialTickets = [
            {
                ticketId: 2,
                fromStatus: TicketStatus.PENDING,
                toStatus: TicketStatus.ASSIGNED,
                actorId: 4,
                nota: "Asignado por administrador",
                createdAt: new Date("2025-10-25T08:15:00"),
                imagenes: { create: [{ url: "error-office.png" }] },
            },
            {
                ticketId: 4,
                fromStatus: TicketStatus.ASSIGNED,
                toStatus: TicketStatus.IN_PROGRESS,
                actorId: 6,
                nota: "Resolviendo acceso al correo",
                createdAt: new Date("2025-10-27T09:00:00"),
                imagenes: { create: [{ url: "falla-red.jpg" }] },
            },
            {
                ticketId: 5,
                fromStatus: TicketStatus.PENDING,
                toStatus: TicketStatus.ASSIGNED,
                actorId: 4,
                nota: "Administrador asigna el ticket al técnico 1.",
                createdAt: new Date("2025-10-28T08:05:00"),
                imagenes: { create: [{ url: "ticket-asigned.jpg" }] },
            },
            {
                ticketId: 5,
                fromStatus: TicketStatus.ASSIGNED,
                toStatus: TicketStatus.IN_PROGRESS,
                actorId: 4,
                nota: "Técnico inicia la revisión del acceso al sistema.",
                createdAt: new Date("2025-10-28T09:00:00"),
                imagenes: { create: [{ url: "ticket-process.jpg" }] },
            },
            {
                ticketId: 5,
                fromStatus: TicketStatus.IN_PROGRESS,
                toStatus: TicketStatus.RESOLVED,
                actorId: 4,
                nota: "Acceso al sistema restaurado correctamente.",
                createdAt: new Date("2025-10-28T11:00:00"),
                imagenes: { create: [{ url: "ticket-solution.jpg" }] },
            },
            {
                ticketId: 5,
                fromStatus: TicketStatus.RESOLVED,
                toStatus: TicketStatus.CLOSED,
                actorId: 7,
                nota: "Cliente confirma la solución y cierra el ticket.",
                createdAt: new Date("2025-10-28T13:00:00"),
                imagenes: { create: [{ url: "acceso-sistema.jpg" }] },
            },
        ];

        for (const h of historialTickets) {
            await prisma.ticketHistorial.create({
                data: {
                    ticketId: h.ticketId,
                    fromStatus: h.fromStatus,
                    toStatus: h.toStatus,
                    actorId: h.actorId,
                    nota: h.nota,
                    createdAt: h.createdAt,
                    imagenes: h.imagenes,
                },
            });
        }

        console.log("✅ Historial insertado con imágenes");
        console.log("🌿 Seed ejecutado correctamente ✅");
    } catch (error) {
        console.error("❌ Error en seed:", error);
    } finally {
        await prisma.$disconnect();
        console.log("🔌 Conexión cerrada");
    }
};

main();
