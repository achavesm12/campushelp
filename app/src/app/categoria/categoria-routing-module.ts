import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriasIndex } from './categoria-index/categoria-index';
import { CategoriaDetail } from './categoria-detail/categoria-detail';
import { CategoriaForm } from './categoria-form/categoria-form';

const routes: Routes = [
  { path: '', component: CategoriasIndex },
  { path: 'form', component: CategoriaForm },
  { path: 'form/:id', component: CategoriaForm },
  { path: ':id', component: CategoriaDetail }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriaRoutingModule { }
