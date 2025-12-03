import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsignacionesIndex } from './asignacion-index/asignacion-index';
import { AsignacionManual } from './asignacion-manual/asignacion-manual';
import { AsignacionAutotriage } from './asignacion-autotriage/asignacion-autotriage';

const routes: Routes = [
  { path: '', component: AsignacionesIndex },
  { path: 'manual/:id', component: AsignacionManual },
  { path: 'autotriage', component: AsignacionAutotriage },
  { path: 'auto', component: AsignacionAutotriage },
  {  path: 'autotriage', component: AsignacionAutotriage }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignacionRoutingModule { }
