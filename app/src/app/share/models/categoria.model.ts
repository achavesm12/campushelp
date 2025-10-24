import { EtiquetaModel } from './etiqueta.model';
import { EspecialidadModel } from './especialidad.model';
import { SlaModel } from './sla.model';

export interface CategoriaModel {
    id: number;
    nombre: string;
    slaId: number;
    updatedAt: Date;
    sla: SlaModel;
    etiquetas: EtiquetaModel[];
    especialidades: EspecialidadModel[];
}
