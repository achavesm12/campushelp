export const categorias = [
    {
        nombre: "Soporte de Red",
        slaId: 1, // Incidentes críticos
        especialidades: [{ id: 1 }, { id: 2 }], // Redes y Software
        etiquetas: [{ id: 1 }, { id: 2 }] // wifi, cuenta
    },
    {
        nombre: "Soporte de Hardware",
        slaId: 2, // Incidentes normales
        especialidades: [{ id: 3 }],
        etiquetas: [{ id: 3 }, { id: 4 }] // impresora, office
    },
    {
        nombre: "Soporte de Software",
        slaId: 2,
        especialidades: [{ id: 2 }],
        etiquetas: [{ id: 4 }, { id: 5 }] // office, licencia
    },
    {
        nombre: "Correo Institucional",
        slaId: 1,
        especialidades: [{ id: 4 }],
        etiquetas: [{ id: 2 }, { id: 6 }] // cuenta, correo
    },
    {
        nombre: "Acceso a Sistemas",
        slaId: 1,
        especialidades: [{ id: 5 }],
        etiquetas: [{ id: 7 }, { id: 8 }] // acceso, sistema
    }
];
