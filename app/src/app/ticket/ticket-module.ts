import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; //formularios
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field'; //mat-form-field
import { MatInputModule } from '@angular/material/input'; //matInput

import { TicketRoutingModule } from './ticket-routing-module';
import { TicketIndex } from './ticket-index/ticket-index';
import { TicketDetail } from './ticket-detail/ticket-detail';

@NgModule({
  declarations: [
    TicketIndex,
    TicketDetail
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    FormsModule,         
    TicketRoutingModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class TicketModule { }
