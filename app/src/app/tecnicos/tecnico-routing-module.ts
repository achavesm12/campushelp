import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TecnicosIndex } from './tecnicos-index/tecnicos-index';
import { TecnicosDetail } from './tecnicos-detail/tecnicos-detail';
import { TecnicosForm } from './tecnicos-form/tecnicos-form';

const routes: Routes = [
{ path: '', component: TecnicosIndex },
{ path: 'form', component: TecnicosForm},
{ path: 'form/:id', component: TecnicosForm},
{ path: ':id', component: TecnicosDetail }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class TecnicoRoutingModule { }
