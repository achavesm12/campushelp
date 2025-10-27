import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsignacionesIndex } from './asignacion-index/asignacion-index';

const routes: Routes = [
  { path: '', component: AsignacionesIndex }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignacionRoutingModule { }
