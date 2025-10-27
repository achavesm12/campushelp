import { Router } from 'express'
import { ValoracionController } from '../controllers/valoracionController'
export class ValoracionRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new ValoracionController()

        // Obtener una valoración por ticket
        router.get("/ticket/:id", controller.getByTicket);

        // Crear valoración (opcional para futuro)
        router.post("/", controller.create);

        return router
    }
}
