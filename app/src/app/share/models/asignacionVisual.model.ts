export interface AsignacionVisualModel {
    id: number;                 // ID del ticket
    titulo: string;             // Título del ticket
    categoria: string;          // Nombre de la categoría
    estado: string;             // Estado del ticket (PENDING, ASSIGNED...)
    tecnico: string;            // Nombre del técnico
    dia: string;                // Día de la semana (sábado, lunes...)
    slaRestanteHoras: number;   // Horas restantes para el SLA
    fechaAsignacion: string;    // Fecha ISO (por si querés mostrarla también)
}
