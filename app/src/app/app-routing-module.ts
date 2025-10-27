import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Inicio } from './home/inicio/inicio';
import { PageNotFound } from './share/page-not-found/page-not-found';

const routes: Routes = [
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

  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: '**', component: PageNotFound }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
