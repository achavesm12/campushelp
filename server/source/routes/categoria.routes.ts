import { Router } from 'express'
import { CategoriaController } from '../controllers/categoriaController'

export class CategoriaRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new CategoriaController()

        //localhost:3000/categoria/create
        router.post('/create', controller.create);

        //localhost:3000/orden
        router.get('/', controller.get) //1 o 0

        router.post('/', controller.create);

        //localhost:3000/categoria/2
        router.get('/:id', controller.getById) //tiene parametro

        router.put('/:id', controller.update);

        return router
    }
}
