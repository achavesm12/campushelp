import { Router } from 'express'
import { TicketController } from '../controllers/ticketController'
export class TicketRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new TicketController()
        //localhost:3000/orden
        router.get('/', controller.get) //1 o 0
        //localhost:3000/orden/2
        router.get('/:id', controller.getById) //tiene parametro

        router.post('/', controller.create);



        return router
    }
}
