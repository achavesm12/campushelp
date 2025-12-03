import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Inicio } from './home/inicio/inicio';
import { PageNotFound } from './share/page-not-found/page-not-found';

const routes: Routes = [

  // 🔥 LOGIN LAZY LOADED
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule)
  },

  // Si se entra a /login, redirige a /auth
  { path: 'login', redirectTo: 'auth', pathMatch: 'full' },

  // 🔥 Página de inicio
  { path: 'inicio', component: Inicio },

  {
    path: 'tecnicos',
    loadChildren: () =>
      import('./tecnicos/tecnico-module').then(m => m.TecnicoModule)
  },
  {
    path: 'categorias',
    loadChildren: () =>
      import('./categoria/categoria-module').then(m => m.CategoriaModule)
  },
  {
    path: 'tickets',
    loadChildren: () =>
      import('./ticket/ticket-module').then(m => m.TicketModule)
  },
  {
    path: 'asignaciones',
    loadChildren: () =>
      import('./asignacion/asignacion-module').then(m => m.AsignacionModule)
  },

  // 🔥 ESTA ES LA RUTA QUE NO TE ESTABA FUNCIONANDO
  { path: '', redirectTo: '/auth', pathMatch: 'full' },

  // 404
  { path: '**', component: PageNotFound },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
