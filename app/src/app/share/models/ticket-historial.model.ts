import { TicketEnum } from '../enums/ticket.enum';
import { TicketImagenModel } from './ticket-imagen.model';

export interface TicketHistorialModel {
    id: number;
    ticketId: number;
    fromStatus?: TicketEnum;
    toStatus: TicketEnum;
    nota?: string;
    actorId: number;
    createdAt: Date;
    updatedAt: Date;
    imagenes: TicketImagenModel[];
}
