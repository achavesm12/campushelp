export interface AsignacionModel {
    id: number;
    ticketId: number;
    usuarioId: number;
    metodo: string;
    justificacion?: string;
    createdAt: Date;
    updatedAt: Date;
}
