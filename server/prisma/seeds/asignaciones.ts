export const asignaciones = [
    {
        ticketId: 1,
        usuarioId: 6, // Técnico 3
        metodo: "Manual",
        justificacion: "Asignado como ejemplo adicional para visualización",
        createdAt: new Date("2025-10-31T09:00:00Z"), // Viernes
    },
    {
        ticketId: 2,
        usuarioId: 4, // Técnico 1
        metodo: "Manual",
        justificacion: "Asignado a Técnico 1 por administrador",
        createdAt: new Date("2025-10-25T08:00:00Z"), // Sábado
    },
    {
        ticketId: 3,
        usuarioId: 5, // Técnico 2
        metodo: "Automático",
        justificacion: "Asignado automáticamente por disponibilidad",
        createdAt: new Date("2025-10-26T08:00:00Z"), // Domingo
    },
    {
        ticketId: 4,
        usuarioId: 6, // Técnico 3
        metodo: "Manual",
        justificacion: "Asignación manual del coordinador",
        createdAt: new Date("2025-10-27T08:00:00Z"), // Lunes
    },
    {
        ticketId: 5,
        usuarioId: 4,
        metodo: "Automático",
        justificacion: "Técnico especializado en correo electrónico",
        createdAt: new Date("2025-10-28T08:00:00Z"), // Martes
    },
    {
        ticketId: 6,
        usuarioId: 5,
        metodo: "Manual",
        justificacion: "Asignado por experiencia previa",
        createdAt: new Date("2025-10-28T14:00:00Z"), // Martes (segunda asignación del día)
    }
];
