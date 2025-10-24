import { RoleEnum } from '../enums/rol-enum';

export interface UsuarioModel {
    id: number;
    email: string;
    nombre?: string;
    role: RoleEnum;
    lastLoginAt?: Date;
    disponibilidad?: boolean;
    cargaActual?: number;
    createdAt: Date;
    updatedAt: Date;
}
