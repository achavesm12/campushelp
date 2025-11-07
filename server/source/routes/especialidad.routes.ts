import { Router } from 'express';
import { EspecialidadController } from '../controllers/especialidadController';


export class EspecialidadRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new EspecialidadController();

        // localhost:3000/especialidad
        router.get('/', controller.get); // listar todas
        router.get('/:id', controller.getById); // obtener por id
        return router;
    }
}
