import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../share/services/api/ticket.service';
import { TicketModel } from '../../share/models/ticket.model';

@Component({
  selector: 'app-ticket-detail',
  standalone: false,
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.css'
})
export class TicketDetail {
  // Signal para almacenar el ticket
  ticket = signal<TicketModel | null>(null);

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private router: Router
  ) {
    this.cargarDetalle();
  }

  cargarDetalle() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.ticketService.getById(id).subscribe({
        next: (resp) => this.ticket.set(resp),
        error: (err) => {
          console.error('Error al cargar ticket:', err);
          this.ticket.set(null);
        }
      });
    } else {
      this.ticket.set(null);
    }
  }

  goBack() {
    this.router.navigate(['/tickets']);
  }
}
