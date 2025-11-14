import { Router } from 'express'
import { TecnicoController } from '../controllers/tecnicoController'

export class TecnicoRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new TecnicoController()

        //localhost:3000/tecnico/update
        router.put('/update/:id', controller.update);

        //localhost:3000/tecnico
        router.get('/', controller.get); //1 o 0

        router.post('/', controller.create);

        //localhost:3000/tecnico/2
        router.get('/:id', controller.getById); //tiene parametro

        router.put('/:id', controller.update);

        return router
    }
}
