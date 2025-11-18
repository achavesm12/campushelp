import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsignacionRoutingModule } from './asignacion-routing-module';

import { AsignacionesIndex } from './asignacion-index/asignacion-index';
import { AsignacionDetail } from './asignacion-detail/asignacion-detail';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AsignacionesIndex,
    AsignacionDetail
  ],
  imports: [
    CommonModule,
    AsignacionRoutingModule,

    // Angular Material que necesita el index.html
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressBarModule,
    TranslateModule
  ]
})
export class AsignacionModule { }
