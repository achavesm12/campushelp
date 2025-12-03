import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; //formularios
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field'; //mat-form-field
import { MatInputModule } from '@angular/material/input'; //matInput
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TicketRoutingModule } from './ticket-routing-module';
import { TicketIndex } from './ticket-index/ticket-index';
import { TicketDetail } from './ticket-detail/ticket-detail';
import { TicketForm } from './ticket-form/ticket-form';
import { TranslateModule } from '@ngx-translate/core';
import { UpdateTicketModal } from './update-ticket-modal/update-ticket-modal';

@NgModule({
  declarations: [
    TicketIndex,
    TicketDetail,
    TicketForm,
    UpdateTicketModal
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
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    TranslateModule
  ]
})
export class TicketModule { }
