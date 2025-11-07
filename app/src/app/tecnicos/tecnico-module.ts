import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TecnicoRoutingModule } from './tecnico-routing-module';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


import { TecnicosIndex } from './tecnicos-index/tecnicos-index';
import { TecnicosDetail } from './tecnicos-detail/tecnicos-detail';
import { TecnicosForm } from './tecnicos-form/tecnicos-form';

@NgModule({
  declarations: [
    TecnicosIndex,
    TecnicosDetail,
    TecnicosForm
  ],

  imports: [
    CommonModule,
    TecnicoRoutingModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDividerModule,
    MatDialogModule,
    MatRadioModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
  ]
})
export class TecnicoModule { }
