import { Router } from 'express';
import { EtiquetaController } from '../controllers/etiquetaController';

export class EtiquetaRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new EtiquetaController();

        router.get('/', controller.get);
        router.get('/:id', controller.getById);

        return router;
    }
}
