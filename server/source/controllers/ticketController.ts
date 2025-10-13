import { Request, Response, NextFunction, request } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient, Role } from "../../generated/prisma";

export class TicketController {
    prisma = new PrismaClient();

    get = async (request: Request, response: Response, next: NextFunction) => {
        try {
            let idUsuario = request.usuario!.id;
            let role: Role = request.usuario.role;
        } catch (error) {
            next(error);
        }
    };

    getById = async (request: Request, response: Response, next: NextFunction) => {
        try {
            

        } catch (error:any) {
            next(error);
        }
    };

    // Obtener un ticket por ID
    getTicketById = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const idTicket = parseInt(request.params.id);

            const ticket = await this.prisma.ticket.findUnique({
                where: { id: idTicket },
                include: {
                    categoria: true,
                    solicitante: true,
                    asignacion: true,
                    historial: true,
                },
            });

            if (!ticket) return response.status(404).json({ message: "Ticket no encontrado" });

            response.json(ticket);

        } catch (error) {
            next(error);
        }
    };
}