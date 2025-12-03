import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsignacionService } from '../../share/services/api/asignacion.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-asignacion-manual',
  standalone: false,
  templateUrl: './asignacion-manual.html',
  styleUrls: ['./asignacion-manual.css']
})
export class AsignacionManual implements OnInit {

  justificacion: string = '';
  errorJustificacion = false;

  filtroEspecialidad = false;
  filtroDisponibles = false;

  tecnicosFiltrados: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private asignacionService: AsignacionService,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
    const idTicket = Number(this.route.snapshot.paramMap.get('id'));

    if (idTicket) {
      this.asignacionService.cargarTecnicosDisponibles(idTicket);

      // Esperar a que signals se actualicen
      setTimeout(() => {
        this.aplicarFiltros();
      }, 0);
    }
  }

  get ticket() {
    return this.asignacionService.ticketInfo();
  }

  get tecnicos() {
    return this.asignacionService.tecnicos();
  }

  aplicarFiltros() {
    let lista = [...this.tecnicos];

    if (this.filtroEspecialidad) {
      lista = lista.filter(t => t.cumpleEspecialidad);
    }

    if (this.filtroDisponibles) {
      lista = lista.filter(t => t.disponibilidad);
    }

    this.tecnicosFiltrados = lista;
  }

  filtrarEspecialidad() {
    this.filtroEspecialidad = !this.filtroEspecialidad;
    this.aplicarFiltros();
  }

  filtrarDisponibles() {
    this.filtroDisponibles = !this.filtroDisponibles;
    this.aplicarFiltros();
  }

  asignar(idTecnico: number) {

    if (!this.ticket) return;

    if (!this.justificacion.trim()) {
      this.errorJustificacion = true;
      return;
    }

    this.errorJustificacion = false;

    const payload = {
      ticketId: this.ticket.id,
      tecnicoId: idTecnico,
      justificacion: this.justificacion.trim()
    };

    this.asignacionService.asignarManual(payload).subscribe({
      next: (resp) => {
        this.snack.open(
          `Ticket asignado a ${resp.tecnico} correctamente`,
          'OK',
          {
            duration: 3000,
            panelClass: ['snackbar-success']
          }
        );

        setTimeout(() => {
          this.router.navigate(['/tickets', this.ticket.id]);
        }, 400);
      },

      error: () => {
        this.snack.open(
          'Error asignando el ticket',
          'Cerrar',
          {
            duration: 3000,
            panelClass: ['snackbar-error']
          }
        );
      }
    });
  }

  volver() {
  this.router.navigate(['/tickets']);
}


}
