import { Router } from 'express'
import { UsuarioController } from '../controllers/usuarioController';

export class UsuarioRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new UsuarioController()

        //localhost:3000/usuario
        router.get('/', controller.get); //1 o 0

        //localhost:3000/usuario/2
        router.get('/:id', controller.getById); //tiene parametro

        return router
    }
}
