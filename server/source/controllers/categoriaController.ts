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

}
