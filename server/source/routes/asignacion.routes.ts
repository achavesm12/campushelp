import { Router } from 'express'
import { AsignacionController } from '../controllers/asignacionController'


export class AsignacionRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new AsignacionController()
        //localhost:3000/orden
        router.get('/', controller.get) //1 o 0

        //localhost:3000/categoria/2
        //router.get('/:id', controller.getById) //tiene parametro

        return router
    }
}
