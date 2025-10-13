import { Request, Response, NextFunction, request } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";

export class TecnicoController {
    prisma = new PrismaClient();

    //obtener los tecnicos
    get = async (request: Request, response: Response, next: NextFunction) => {
        try {            
            const tecnicos = await this.prisma.usuario.findMany({
                where: { role: 'TECH' }, //filtra por técnicos porque no hay una tabla de técnicos como tal
                orderBy: {
                    nombre: "asc"
                },
                select: {
                    id: true,
                    nombre: true,
                    email: true,
                    disponibilidad: true,
                    cargaActual: true,
                    especialidades: true
                }
            });
            response.json(tecnicos)
        } catch (error) {
            next(error);
        }
    };

    //obtener técnico por ID
    getById = async (request: Request, response: Response, next: NextFunction) => {
        try {
            let idTecnico = parseInt(request.params.id)
            const tecnico = await this.prisma.usuario.findUnique({
                where: { id : idTecnico },
                select: {
                    id: true,
                    nombre: true,
                    email: true,
                    disponibilidad: true,
                    cargaActual: true,
                    especialidades: true,
                    role: true
                }
            });
            if (!tecnico || tecnico.role !== 'TECH') {
                return response.status(404).json({ message: 'Técnico no encontrado'});
            }

            response.json(tecnico);

        } catch (error:any) {
            next(error);
        }
    };
}