import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from '../../share/services/api/ticket.service';
import { ValoracionService } from '../../share/services/api/valoracion.service'; // ⚡ nuevo servicio
import { TicketModel } from '../../share/models/ticket.model';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-ticket-detail',
  standalone: false,
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.css'
})
export class TicketDetail {
  // Signal para almacenar el ticket
  ticket = signal<TicketModel | null>(null);
  valoracionForm!: FormGroup;
  valoracion: any = null; // para almacenar si ya existe una valoración
  usuarioActualId = 4; //ID del usuario logueado 

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private valoracionService: ValoracionService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.valoracionForm = this.fb.group({
      puntaje: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comentario: ['']
    });
    this.cargarDetalle();
  }

  cargarDetalle() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.ticketService.getById(id).subscribe({
        next: (resp) => {
          this.ticket.set(resp);
          this.cargarValoracion(resp.id);
        },
        error: (err) => {
          console.error('Error al cargar ticket:', err);
          this.ticket.set(null);
        }
      });
    } else {
      this.ticket.set(null);
    }
  }

  cargarValoracion(ticketId: number) {
    this.valoracionService
      .getByTicket(ticketId)
      .pipe(
        catchError((err) => {
          if (err.status === 404) {
            // si no hay reseña se devuelve null sin mostrar error
            this.valoracion = null;
            return of(null);
          }
          console.error('Error al cargar valoración:', err);
          return of(null);
        })
      )
      .subscribe((val) => {
        this.valoracion = val;
      });
  }

  setPuntaje(value: number) {
    this.valoracionForm.patchValue({ puntaje: value });
  }

  registrarValoracion() {
    if (this.ticket() && this.valoracionForm.valid) {
      const payload = {
        ticketId: this.ticket()!.id,
        usuarioId: this.usuarioActualId,
        puntaje: this.valoracionForm.value.puntaje,
        comentario: this.valoracionForm.value.comentario
      };

      this.valoracionService.createForTicket(payload).subscribe({
        next: () => this.cargarValoracion(payload.ticketId),
        error: (err) => console.error('Error al guardar valoración:', err)
      });
    }
  }

  goBack() {
    this.router.navigate(['/tickets']);
  }
}
