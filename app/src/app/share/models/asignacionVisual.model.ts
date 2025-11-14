export interface AsignacionVisualModel {
    id: number;                 // ID del ticket
    titulo: string;
    categoria: string;          // Nombre de la categoría
    estado: string;
    tecnico: string;
    dia: string;
    slaRestanteHoras: number;
    fechaAsignacion: string;
}
