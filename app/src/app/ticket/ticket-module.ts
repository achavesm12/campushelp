import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketRoutingModule } from './ticket-routing-module';
import { TicketIndex } from './ticket-index/ticket-index';
import { TicketDetail } from './ticket-detail/ticket-detail';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    TicketIndex,
    TicketDetail
  ],
  imports: [
    CommonModule,
    TicketRoutingModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule
  ]
})
export class TicketModule { }
