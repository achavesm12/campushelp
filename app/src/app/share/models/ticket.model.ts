import { UsuarioModel } from './usuario.model';
import { CategoriaModel } from './categoria.model';
import { TicketHistorialModel } from './ticket-historial.model';
import { AsignacionModel } from './asignacion.model';
import { ValoracionModel } from './valoracion.model';
import { TicketEnum } from '../enums/ticket.enum';

export interface TicketModel {
    id: number;
    titulo: string;
    descripcion: string;
    status: TicketEnum;
    createdAt: Date;
    updatedAt: Date;
    closedAt?: Date;
    solicitanteId: number;
    categoriaId: number;

    solicitante: UsuarioModel;
    categoria: CategoriaModel;
    historial: TicketHistorialModel[];
    asignacion?: AsignacionModel;
    valoracion?: ValoracionModel;

    //CAMPOS CALCULADOS:
    diasResolucion: number;
    fechaLimiteRespuesta: string;
    fechaLimiteResolucion: string;
    cumplioRespuesta: boolean;
    cumplioResolucion: boolean;
}
