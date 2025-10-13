/* export const categorias = [
    { nombre: "Soporte de Red", slaId: 1 },
    { nombre: "Correo Institucional", slaId: 2 },
    { nombre: "Préstamo de Equipos", slaId: 2 },
    { nombre: "Instalación de Software", slaId: 2 },
];
 */

export const categorias = [
    {
        nombre: "Soporte de Red",
        slaId: 1,
        especialidades: [{ id: 1 }, { id: 2 }],
        etiquetas: [{ id: 1 }, { id: 2 }],
    },
    {
        nombre: "Soporte de Hardware",
        slaId: 2,
        especialidades: [{ id: 3 }],
        etiquetas: [{ id: 3 }, { id: 4 }],
    },
];
