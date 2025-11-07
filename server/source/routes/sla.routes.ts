import { Router } from 'express';
import { SlaController } from '../controllers/slaController';

export class SlaRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new SlaController();

        router.get('/', controller.get);
        router.get('/:id', controller.getById);

        return router;
    }
}
