import { Router } from 'express'
import { TecnicoController } from '../controllers/tecnicoController'
export class TecnicoRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new TecnicoController()
        //localhost:3000/orden
        router.get('/', controller.get) //1 o 0
        //localhost:3000/orden/2
        router.get('/:id', controller.getById) //tiene parametro


        return router
    }
}
