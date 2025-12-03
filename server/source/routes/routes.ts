import { Router } from 'express';
import { TecnicoRoutes } from './tecnico.routes';
import { CategoriaRoutes } from './categoria.routes';
import { TicketRoutes } from './ticket.routes';
import { AsignacionRoutes } from './asignacion.routes';
import { ValoracionRoutes } from './valoracion.routes';
import { EspecialidadRoutes } from './especialidad.routes';
import { SlaRoutes } from './sla.routes';
import { EtiquetaRoutes } from './etiqueta.routes';
import { PrioridadRoutes } from './prioridad.routes';
import { UsuarioRoutes } from './usuario.routes';
import { AuthRoutes } from './auth.routes';
import { NotificacionRoutes } from './notificacion.routes';

export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        // ----Agregar las rutas----
        router.use('/tecnico', TecnicoRoutes.routes)
        router.use('/categorias', CategoriaRoutes.routes)
        router.use('/ticket', TicketRoutes.routes)
        router.use('/asignacion', AsignacionRoutes.routes)
        router.use('/valoraciones', ValoracionRoutes.routes)
        router.use('/especialidad', EspecialidadRoutes.routes);
        router.use('/sla', SlaRoutes.routes);
        router.use('/etiquetas', EtiquetaRoutes.routes);
        router.use("/prioridades", PrioridadRoutes.routes);
        router.use("/usuarios", UsuarioRoutes.routes);
        router.use('/auth', AuthRoutes.routes());
        router.use('/notificaciones', NotificacionRoutes.routes);

        return router;
    }
}
