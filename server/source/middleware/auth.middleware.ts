import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/custom.error";

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) return next(AppError.unauthorized("Token requerido"));

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secreto-super-seguro");
        req.user = decoded;
        next();
    } catch (error) {
        next(AppError.unauthorized("Token inválido o expirado"));
    }
};
