import { TicketEnum } from '../enums/ticket.enum';
import { TicketImagenModel } from './ticket-imagen.model';
import { UsuarioModel } from './usuario.model';

export interface TicketHistorialModel {
    id: number;
    ticketId: number;
    fromStatus?: TicketEnum;
    toStatus: TicketEnum;
    nota?: string;
    actorId: number;
    actor?: UsuarioModel;
    createdAt: Date;
    updatedAt: Date;
    imagenes: TicketImagenModel[];
}
