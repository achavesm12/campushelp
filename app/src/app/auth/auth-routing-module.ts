import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthIndex } from './auth-index/auth-index';

const routes: Routes = [
  { path: '', component: AuthIndex }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
