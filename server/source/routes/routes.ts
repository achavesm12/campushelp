import { Router } from 'express';
import { TecnicoRoutes } from './tecnico.routes';
import { CategoriaRoutes } from './categoria.routes';
import { TicketRoutes } from './ticket.routes';
import { AsignacionRoutes } from './asignacion.routes';

export class AppRoutes {
    static get routes(): Router {
        const router = Router();
        
        // ----Agregar las rutas----
        router.use('/tecnico', TecnicoRoutes.routes)
        router.use('/categorias', CategoriaRoutes.routes)
        router.use('/ticket', TicketRoutes.routes)
            router.use('/asignacion', AsignacionRoutes.routes)
        

        return router;
    }
}
