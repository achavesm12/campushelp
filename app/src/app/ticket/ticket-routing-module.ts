import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketIndex } from './ticket-index/ticket-index';
import { TicketDetail } from './ticket-detail/ticket-detail';
import { TicketForm } from './ticket-form/ticket-form';

const routes: Routes = [
  { path: '', component: TicketIndex },           // Listado
  { path: 'create', component: TicketForm },      // Crear
  { path: ':id', component: TicketDetail }        // Detalle
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRoutingModule { }
