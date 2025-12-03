import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { NotificacionController } from "../controllers/notificacionController";

export class NotificacionRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new NotificacionController();

        router.get("/", authMiddleware, controller.listar);
        router.get("/count", authMiddleware, controller.contarNoLeidas);
        router.patch("/:id/read", authMiddleware, controller.marcarComoLeida);

        return router;
    }
}
