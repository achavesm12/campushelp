export interface SlaModel {
    id: number;
    nombre: string;
    maxRespuestaHrs: number;
    maxResolucionHrs: number;
    prioridad: string; // podría convertirse a enum si se estandariza
    updatedAt: Date;
}
