export const historialTickets = [
    // Ticket 2 - ASSIGNED
    {
        ticketId: 2,
        fromStatus: "PENDING",
        toStatus: "ASSIGNED",
        actorId: 4, // Técnico 1
        nota: "Asignado por administrador",
        createdAt: new Date("2025-10-25T08:15:00")
    },

    // Ticket 3 - IN_PROGRESS
    {
        ticketId: 3,
        fromStatus: "PENDING",
        toStatus: "ASSIGNED",
        actorId: 5, // Técnico 2
        nota: "Asignación automática",
        createdAt: new Date("2025-10-26T08:10:00")
    },
    {
        ticketId: 3,
        fromStatus: "ASSIGNED",
        toStatus: "IN_PROGRESS",
        actorId: 5,
        nota: "Iniciado análisis del problema",
        createdAt: new Date("2025-10-26T09:00:00")
    },

    // Ticket 4 - RESOLVED
    {
        ticketId: 4,
        fromStatus: "PENDING",
        toStatus: "ASSIGNED",
        actorId: 6, // Técnico 3
        nota: "Asignación manual",
        createdAt: new Date("2025-10-27T08:05:00")
    },
    {
        ticketId: 4,
        fromStatus: "ASSIGNED",
        toStatus: "IN_PROGRESS",
        actorId: 6,
        nota: "Resolviendo acceso",
        createdAt: new Date("2025-10-27T09:00:00")
    },
    {
        ticketId: 4,
        fromStatus: "IN_PROGRESS",
        toStatus: "RESOLVED",
        actorId: 6,
        nota: "Correo funcional",
        createdAt: new Date("2025-10-27T10:30:00")
    },

    // Ticket 5 - CLOSED
    {
        ticketId: 5,
        fromStatus: "PENDING",
        toStatus: "ASSIGNED",
        actorId: 4,
        nota: "Técnico asignado",
        createdAt: new Date("2025-10-28T08:00:00")
    },
    {
        ticketId: 5,
        fromStatus: "ASSIGNED",
        toStatus: "IN_PROGRESS",
        actorId: 4,
        nota: "Gestionando acceso",
        createdAt: new Date("2025-10-28T09:00:00")
    },
    {
        ticketId: 5,
        fromStatus: "IN_PROGRESS",
        toStatus: "RESOLVED",
        actorId: 4,
        nota: "Resuelto",
        createdAt: new Date("2025-10-28T11:00:00")
    },
    {
        ticketId: 5,
        fromStatus: "RESOLVED",
        toStatus: "CLOSED",
        actorId: 3, // Cliente (cierre)
        nota: "Gracias por el soporte",
        createdAt: new Date("2025-10-28T13:00:00")
    },

    // Ticket 6 - PENDING (sin historial aún = sin datos)
];
