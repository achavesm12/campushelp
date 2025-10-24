import { PrismaClient, Role, TicketStatus } from "../generated/prisma";
import { usuarios } from "./seeds/usuarios";
import { especialidades } from "./seeds/especialidades";
import { categorias } from "./seeds/categorias";
import { etiquetas } from "./seeds/etiquetas";
import { slas } from "./seeds/sla";

const prisma = new PrismaClient();

const main = async () => {
    try {
        console.log("🌱 Iniciando seed...");

        // 1️⃣ Usuarios
        await prisma.usuario.createMany({
            data: usuarios,
            skipDuplicates: true,
        });
        console.log("✅ Usuarios insertados");

        // 2️⃣ Especialidades
        await prisma.especialidad.createMany({
            data: especialidades,
            skipDuplicates: true,
        });
        console.log("✅ Especialidades insertadas");

        // 3️⃣ SLA
        await prisma.sLA.createMany({
            data: slas,
            skipDuplicates: true,
        });
        console.log("✅ SLA insertados");

        // 4️⃣ Etiquetas
        await prisma.etiqueta.createMany({
            data: etiquetas,
            skipDuplicates: true,
        });
        console.log("✅ Etiquetas insertadas");

        // 5️⃣ Categorías
        await prisma.categoria.createMany({
            data: categorias.map(cat => ({
                nombre: cat.nombre,
                slaId: cat.slaId,
            })),
            skipDuplicates: true,
        });
        console.log("✅ Categorías insertadas");

        // 6️⃣ Conectar especialidades y etiquetas a cada categoría
        for (const cat of categorias) {
            await prisma.categoria.update({
                where: { nombre: cat.nombre },
                data: {
                    especialidades: {
                        connect: cat.especialidades.map(e => ({ id: e.id })),
                    },
                    etiquetas: {
                        connect: cat.etiquetas.map(t => ({ id: t.id })),
                    },
                },
            });
        }
        console.log("✅ Relaciones entre categorías, especialidades y etiquetas creadas");

        // 7️⃣ Conectar especialidades a los técnicos
        const tecnicos = [
            { id: 4, especialidades: [1, 2] }, // Técnico 1: Redes, Software
            { id: 5, especialidades: [3] },    // Técnico 2: Hardware
            { id: 6, especialidades: [4] },    // Técnico 3: Correo
        ];


        for (const tec of tecnicos) {
            await prisma.usuario.update({
                where: { id: tec.id },
                data: {
                    especialidades: {
                        connect: tec.especialidades.map(id => ({ id })),
                    },
                },
            });
        }
        console.log("✅ Especialidades asignadas a todos los técnicos");

        // 8️⃣ Tickets de prueba usando enum TicketStatus
        const tickets = [
            { titulo: "Problema con WiFi", descripcion: "El internet se desconecta", solicitanteId: 3, categoriaId: 1, status: TicketStatus.PENDING },
            { titulo: "Error Office", descripcion: "No puedo abrir Word", solicitanteId: 4, categoriaId: 2, status: TicketStatus.ASSIGNED },
            { titulo: "Impresora no funciona", descripcion: "La impresora del laboratorio no imprime", solicitanteId: 3, categoriaId: 2, status: TicketStatus.PENDING },
            { titulo: "Falla en correo", descripcion: "No llegan los mensajes", solicitanteId: 4, categoriaId: 1, status: TicketStatus.ASSIGNED },
            { titulo: "Red lenta", descripcion: "La red del edificio es muy lenta", solicitanteId: 3, categoriaId: 1, status: TicketStatus.PENDING },
            { titulo: "Sin acceso al sistema", descripcion: "No puedo ingresar al sistema institucional", solicitanteId: 4, categoriaId: 2, status: TicketStatus.RESOLVED },
        ];


        for (const t of tickets) {
            await prisma.ticket.create({ data: t });
        }
        console.log("✅ Tickets insertados");

        // 9️⃣ Asignaciones de tickets
        // 9️⃣ Asignaciones actualizadas
        const asignaciones = [
            { ticketId: 2, usuarioId: 4, metodo: "Manual", justificacion: "Asignado a Técnico 1 por administrador" },
            { ticketId: 3, usuarioId: 5, metodo: "Automático", justificacion: "Asignado automáticamente por disponibilidad" },
            { ticketId: 4, usuarioId: 6, metodo: "Manual", justificacion: "Asignación manual del coordinador" },
            { ticketId: 5, usuarioId: 4, metodo: "Automático", justificacion: "Técnico especializado en correo electrónico" },
            { ticketId: 6, usuarioId: 5, metodo: "Manual", justificacion: "Asignado por experiencia previa" },
            { ticketId: 7, usuarioId: 6, metodo: "Automático", justificacion: "Asignación automática basada en carga de trabajo" },
        ];


        for (const a of asignaciones) {
            await prisma.asignacion.create({ data: a });
        }
        console.log("✅ Asignaciones creadas");

        console.log("🌿 Seed ejecutado correctamente ✅");
    } catch (error) {
        console.error("❌ Error en seed:", error);
    } finally {
        await prisma.$disconnect();
        console.log("🔌 Conexión cerrada");
    }
};

main()
    .then(async () => {
        await prisma.$disconnect();
        console.log("🔌 Conexión cerrada");
    })
    .catch(async (e) => {
        console.error("⚠️ Error general:", e);
        await prisma.$disconnect();
    });
