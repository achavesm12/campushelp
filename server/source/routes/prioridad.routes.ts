import { Router } from 'express';
import { PrioridadController } from '../controllers/prioridadController';

export class PrioridadRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new PrioridadController();

        router.get('/', controller.get);
        router.get('/:id', controller.getById);

        return router;
    }
}
