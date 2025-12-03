import { Router } from "express";
import { AuthController } from "../controllers/authController";

export class AuthRoutes {
    static routes(): Router {
        const router = Router();
        const controller = new AuthController();

        router.post("/login", controller.login);

        return router;
    }
}
