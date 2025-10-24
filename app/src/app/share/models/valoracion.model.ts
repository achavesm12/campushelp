export interface ValoracionModel {
    id: number;
    ticketId: number;
    usuarioId: number;
    puntaje: number;
    comentario?: string;
    createdAt: Date;
    updatedAt: Date;
}
