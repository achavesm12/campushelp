export interface NotificacionModel {
    id: number;
    usuarioId: number;
    actorId?: number | null;
    ticketId?: number | null;
    tipo: string;
    mensaje: string;
    descripcion?: string | null;
    leida: boolean;
    createdAt: string;
    updatedAt: string;
}
