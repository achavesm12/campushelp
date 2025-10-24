import { Request, Response, NextFunction, request } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";

export class TecnicoController {
    prisma = new PrismaClient();

    //obtener los tecnicos
    get = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const tecnicos = await this.prisma.usuario.findMany({
                where: { role: 'TECH' },
                include: {
                    asignaciones: {
                        include: {
                            ticket: true
                        }
                    },
                    especialidades: true
                },
                orderBy: {
                    nombre: "asc"
                }
            });

            const resultado = tecnicos.map(tecnico => {
                const carga = tecnico.asignaciones.filter(asig => asig.ticket?.status !== 'CLOSED').length;

                return {
                    id: tecnico.id,
                    nombre: tecnico.nombre,
                    email: tecnico.email,
                    disponibilidad: tecnico.disponibilidad,
                    cargaActual: carga,
                    especialidades: tecnico.especialidades.map(e => e.nombre)
                };
            });

            response.json(resultado);
        } catch (error) {
            next(error);
        }
    };

    getById = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const idTecnico = parseInt(request.params.id);

            const tecnico = await this.prisma.usuario.findUnique({
                where: { id: idTecnico },
                include: {
                    asignaciones: {
                        include: {
                            ticket: true,
                        },
                    },
                    especialidades: {
                        select: {
                            nombre: true,
                            descripcion: true,
                        },
                    },
                },
            });

            if (!tecnico || tecnico.role !== 'TECH') {
                return response.status(404).json({ message: 'Técnico no encontrado' });
            }

            // Calcular carga actual según tickets no cerrados
            const carga = tecnico.asignaciones.filter(
                (asig) => asig.ticket && asig.ticket.status !== 'CLOSED'
            ).length;

            const detalle = {
                id: tecnico.id,
                nombre: tecnico.nombre,
                email: tecnico.email,
                disponibilidad: tecnico.disponibilidad,
                cargaActual: carga,
                especialidades: tecnico.especialidades,
            };

            response.json(detalle);
        } catch (error: any) {
            next(error);
        }
    };



    //obtener técnico por ID
    /*getById = async (request: Request, response: Response, next: NextFunction) => {
        try {
            let idTecnico = parseInt(request.params.id)
            const tecnico = await this.prisma.usuario.findUnique({
                where: { id: idTecnico },
                include: {
                    asignaciones: {
                        include: {
                            ticket: true
                        }
                    },
                    especialidades: {
                        select: {
                            nombre: true,
                            descripcion: true
                        }
                    }
                }
            });


            if (!tecnico || tecnico.role !== 'TECH') {
                return response.status(404).json({ message: 'Técnico no encontrado' });
            }

            const carga = tecnico.asignaciones.filter(asig => asig.ticket?.status !== 'CLOSED').length;

            const detalle = {
                id: tecnico.id,
                nombre: tecnico.nombre,
                email: tecnico.email,
                disponibilidad: tecnico.disponibilidad,
                cargaActual: carga,
                especialidades: tecnico.especialidades
            };

            response.json(tecnico);

        } catch (error: any) {
            next(error);
        }
    }; */
}