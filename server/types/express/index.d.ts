import "express-serve-static-core";

declare module "express-serve-static-core" {
    interface Request {
        user?: {
            id: number;
            role: string;
            // podes agregar más si tu JWT trae más valores
        };
    }
}
