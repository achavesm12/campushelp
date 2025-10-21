/* import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from './header/header';
import { Footer } from './footer/footer';



@NgModule({
  declarations: [
    Header,
    Footer
  ],
  imports: [
    CommonModule
  ],
  exports: [
    Header,
    Footer
  ]
})
export class CoreModule { }
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; //enlaces del header

import { Header } from './header/header';
import { Footer } from './footer/footer';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    Header,
    Footer
  ],
  imports: [
    CommonModule,
    RouterModule, //<a routerLink=""> en el header
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule
  ],
  exports: [
    Header,
    Footer
  ]
})
export class CoreModule { }
