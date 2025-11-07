import { Request, Response, NextFunction, request, response } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";
import { Prisma } from '../../generated/prisma';


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

    //obtener por id
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
                            id: true,
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

    //crear un técnico
    create = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const body = request.body;

            const newTecnico = await this.prisma.usuario.create({
                data: {
                    nombre: body.nombre,
                    email: body.email,
                    password: '1234',
                    role: 'TECH',
                    disponibilidad: body.disponibilidad ?? true,
                    cargaActual: 0,
                    especialidades: {
                        connect: body.especialidades.map((e: number) => ({ id: e })),
                    },
                },
                include: { especialidades: true },
            });

            response.status(201).json(newTecnico);
        } catch (error: any) {
            console.error('Error creando el técnico:', error);

            // Detección del error P2002 (clave única violada)
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                const target =
                    Array.isArray(error.meta?.target) ? error.meta.target[0] : error.meta?.target;

                if (target === 'email' || target === 'Usuario_email_key') {
                    return response.status(400).json({
                        message: 'El correo ingresado ya está registrado.',
                    });
                }
            }

            //Error genérico
            return response.status(500).json({
                message: 'Error interno al crear el técnico',
                details: error.message,
            });
        }
    };


    update = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const body = request.body;
            const idTecnico = parseInt(request.params.id);

            //obtener el técnico existente
            const tecnicoExistente = await this.prisma.usuario.findUnique({
                where: { id: idTecnico },
                include: {
                    especialidades: {
                        select: { id: true }
                    },
                },
            });

            if (!tecnicoExistente) {
                response.status(404).json({ message: "El técnico no existe" });
                return;
            }

            //desconectar las viejas especialidades y conectar las nuevas
            const disconnectEsp = tecnicoExistente.especialidades.map(
                (esp: { id: number }) => ({ id: esp.id })
            );

            const connectEsp = body.especialidades ? body.especialidades.map(
                (esp: { id: number }) => ({ id: esp.id })) : [];

            //actualizar el técnico
            const updateTecnico = await this.prisma.usuario.update({
                where: { id: idTecnico },
                data: {
                    nombre: body.nombre,
                    email: body.email,
                    password: body.password,
                    disponibilidad: body.disponibilidad,
                    especialidades: {
                        disconnect: disconnectEsp,
                        connect: connectEsp,
                    },
                },
                include: {
                    especialidades: true
                }
            });
            response.json(updateTecnico);

        } catch (error: any) {
            console.error("Error actualizando los datos: ", error);
            next(error);
        }
    };

}