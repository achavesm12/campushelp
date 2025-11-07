import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";
import { AppError } from "../errors/custom.error";

export class CategoriaController {
    prisma = new PrismaClient();

    // Obtener todas las categorías
    get = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const categorias = await this.prisma.categoria.findMany({
                select: {
                    id: true,
                    nombre: true,
                    sla: {
                        select: {
                            nombre: true,
                            maxRespuestaHrs: true,
                            maxResolucionHrs: true,
                        },
                    },
                    especialidades: {
                        select: {
                            id: true,
                            nombre: true,
                        },
                    },
                    etiquetas: {
                        select: {
                            id: true,
                            nombre: true,
                        },
                    },
                },

                orderBy: { nombre: 'asc' },
            });

            response.json(categorias);
        } catch (error) {
            next(error);
        }
    };

    getById = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const idCategoria = parseInt(request.params.id);
            if (isNaN(idCategoria)) {
                return next(AppError.badRequest("El ID no es válido"));
            }

            const categoria = await this.prisma.categoria.findFirst({
                where: { id: idCategoria },
                include: {
                    etiquetas: true, // trae todas las etiquetas asociadas
                    especialidades: true, // trae todas las especialidades asociadas
                    sla: true, // si quieres incluir el SLA
                },
            });

            if (!categoria) {
                return response.status(404).json({ message: "Categoría no encontrada" });
            }

            response.status(200).json(categoria);
        } catch (error) {
            next(error);
        }
    };

    create = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const body = request.body;
            console.log('BODY RECIBIDO:', body);

            const newCategoria = await this.prisma.categoria.create({
                data: {
                    nombre: body.nombre,
                    slaId: body.slaId ?? null,

                    // Validación segura para evitar error al hacer map()
                    etiquetas: body.etiquetas?.length
                        ? { connect: body.etiquetas.map((id: number) => ({ id })) }
                        : undefined,

                    especialidades: body.especialidades?.length
                        ? { connect: body.especialidades.map((id: number) => ({ id })) }
                        : undefined,
                },
                include: {
                    sla: true,
                    etiquetas: true,
                    especialidades: true,
                },
            });

            response.status(201).json(newCategoria);
        } catch (error: any) {
            console.error('Error creando la categoría:', error);

            // Si Prisma lanza un error conocido (clave duplicada, etc.)
            if (error.code === 'P2002') {
                return response.status(400).json({
                    message: 'Ya existe una categoría con ese nombre.',
                });
            }

            // Error genérico
            response.status(500).json({
                message: 'Error interno al crear la categoría',
                details: error.message,
            });
        }
    };

    update = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const body = request.body;
            const idCategoria = parseInt(request.params.id);

            const categoriaExistente = await this.prisma.categoria.findUnique({
                where: { id: idCategoria },
                include: {
                    etiquetas: {
                        select: {
                            id: true
                        }
                    },
                    especialidades: {
                        select: {
                            id: true
                        }
                    },
                    sla: true,
                },
            });

            if (!categoriaExistente) {
                response.status(404).json({ message: "La categoría no existe" });
                return;
            }

            //desconectar y conectar 
            const disconnectEtiq = categoriaExistente.etiquetas.map((
                etiq: {id: number }) => ({ id: etiq.id}));
            const disconnectEsp = categoriaExistente.especialidades.map((
                esp: { id: number }) => ({ id: esp.id}));

            const connectEtiq = body.etiquetas ? body.etiquetas.map((id: number) => ({ id })) : [];
            const connectEsp = body.especialidades ? body.especialidades.map((id: number) => ({ id })) : [];

            const updateCategoria = await this.prisma.categoria.update({
                where: {id: idCategoria},
                data: {
                    nombre: body.nombre,
                    slaId: body.slaId ?? null,
                    etiquetas: {
                        disconnect: disconnectEtiq,
                        connect: connectEtiq,
                    },
                    especialidades: {
                        disconnect: disconnectEsp,
                        connect: connectEsp,
                    },
                },
                include: {
                    sla: true,
                    etiquetas: true,
                    especialidades: true
                },
            });

            response.status(200).json({ message: "Categoría actualizada correctamente", categoria: updateCategoria, });
        } catch (error) {
            console.error("Error al actualizar la categoría", error);
            next(error);
        }
    };


}
