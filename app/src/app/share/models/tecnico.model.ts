import { EspecialidadModel } from './especialidad.model';

export interface TecnicoModel {
    id: number;
    nombre: string;
    email: string;
    disponibilidad: boolean;
    cargaActual: number;
    createdAt: Date;
    updatedAt: Date;
    especialidades: EspecialidadModel[]; // relación M:N
}
