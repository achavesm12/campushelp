import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing-module';
import { AuthIndex } from './auth-index/auth-index';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AuthIndex
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    TranslateModule
  ],
  exports: [
    AuthIndex
  ]
})
export class AuthModule { }
