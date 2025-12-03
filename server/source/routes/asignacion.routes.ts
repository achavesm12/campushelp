import { Router } from "express";
import { AsignacionController } from "../controllers/asignacionController";
import { authMiddleware } from "../middleware/auth.middleware";

export class AsignacionRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new AsignacionController();

        router.get("/", authMiddleware, controller.get);
        router.get("/manual/:idTicket", authMiddleware, controller.getTecnicosDisponibles);

        router.post("/manual", authMiddleware, controller.asignacionManual);

        router.post("/automatico", authMiddleware, controller.asignacionAutomatica);

        router.get("/visual", authMiddleware, controller.getVisual);

        return router;
    }
}
