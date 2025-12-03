import { Router } from 'express'
import { TicketController, uploadHistorial } from '../controllers/ticketController'
import { authMiddleware } from '../middleware/auth.middleware'

export class TicketRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new TicketController()
        //localhost:3000/ticket
        router.get('/', controller.get) //1 o 0
        //localhost:3000/ticket/2
        router.get('/:id', controller.getById) //tiene parametro

        router.post('/', controller.create);

        router.patch('/:id/estado',
            uploadHistorial.array("imagenes"),
            controller.updateStatus
        );

        router.patch(
            "/:id/estado",
            authMiddleware,                       // proteger la ruta
            uploadHistorial.array("imagenes"),    // subir imágenes
            controller.updateStatus                // lógica de cambio de estado
        );

        return router
    }
}
