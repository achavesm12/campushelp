export const tickets = [
    {
        id: 1,
        titulo: "Problema con WiFi",
        descripcion: "El internet se desconecta constantemente",
        solicitanteId: 3,
        categoriaId: 1,
        status: "ASSIGNED", // Podés cambiarlo si querés duplicar visualmente otros estados
        createdAt: new Date("2025-10-31T09:00:00"), // Viernes
    },
    {
        id: 2,
        titulo: "Error Office",
        descripcion: "No puedo abrir Microsoft Word",
        solicitanteId: 4,
        categoriaId: 3,
        status: "ASSIGNED",
        createdAt: new Date("2025-10-25T08:00:00"),
    },
    {
        id: 3,
        titulo: "Impresora no funciona",
        descripcion: "La impresora del laboratorio no imprime",
        solicitanteId: 5,
        categoriaId: 2,
        status: "IN_PROGRESS",
        createdAt: new Date("2025-10-26T08:00:00"),
    },
    {
        id: 4,
        titulo: "Problemas de acceso a correo",
        descripcion: "No puedo ingresar a mi correo institucional",
        solicitanteId: 3,
        categoriaId: 4,
        status: "RESOLVED",
        createdAt: new Date("2025-10-27T08:00:00"),
    },
    {
        id: 5,
        titulo: "Solicito acceso al sistema académico",
        descripcion: "No tengo permisos para ingresar",
        solicitanteId: 4,
        categoriaId: 5,
        status: "CLOSED",
        createdAt: new Date("2025-10-28T08:00:00"),
        closedAt: new Date("2025-10-28T13:00:00"),
    },
    {
        id: 6,
        titulo: "VPN no se conecta",
        descripcion: "VPN falla actualización",
        solicitanteId: 5,
        categoriaId: 1,
        status: "PENDING",
        createdAt: new Date("2025-10-28T14:00:00"),
    },
    {
        id: 7,
        titulo: "Restablecer contraseña",
        descripcion: "No puedo ingresar al sistema y necesito restablecer la clave.",
        solicitanteId: 5,
        categoriaId: 2,
        status: "CLOSED",
        createdAt: new Date("2025-10-29T09:00:00"),
        closedAt: new Date("2025-10-29T11:30:00"),
    }

];
