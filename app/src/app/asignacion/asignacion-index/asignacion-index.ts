import { Component, signal } from '@angular/core';
import { AsignacionService } from '../../share/services/api/asignacion.service';
import { Router } from '@angular/router';
import { AsignacionVisualModel } from '../../share/models/asignacionVisual.model';

@Component({
  selector: 'app-asignaciones-index',
  standalone: false,
  templateUrl: './asignacion-index.html',
  styleUrls: ['./asignacion-index.css']
})
export class AsignacionesIndex {
  datos = signal<AsignacionVisualModel[]>([]);

  constructor(
    private asignacionService: AsignacionService,
    private router: Router
  ) {
    this.listarAsignaciones();
  }

  listarAsignaciones() {
    this.asignacionService.getVisual().subscribe({
      next: (respuesta: AsignacionVisualModel[]) => {
        console.log('Asignaciones desde API:', respuesta);
        this.datos.set(respuesta);
      },
      error: (err) => {
        console.error('Error cargando asignaciones:', err);
      }
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/tickets', id]);
  }

  diasUnicos(asignaciones: AsignacionVisualModel[]): string[] {
    return [...new Set(asignaciones.map(a => a.dia))];
  }

  estadoColor(estado: string): string {
    switch (estado) {
      case 'PENDING': return 'estado-pendiente';
      case 'ASSIGNED': return 'estado-asignado';
      case 'IN_PROGRESS': return 'estado-enprogreso';
      case 'RESOLVED': return 'estado-resuelto';
      case 'CLOSED': return 'estado-cerrado';
      default: return '';
    }
  }

  filtrarPorDia(dia: string): AsignacionVisualModel[] {
    return this.datos().filter(a => a.dia === dia);
  }

  calcularSLAProgreso(restante: number): number {
    return Math.max(0, 100 - restante * 4);
  }

  traducirDia(dia: string): string {
    const mapaDias: Record<string, string> = {
      'lunes': 'DAYS.MONDAY',
      'martes': 'DAYS.TUESDAY',
      'miércoles': 'DAYS.WEDNESDAY',
      'jueves': 'DAYS.THURSDAY',
      'viernes': 'DAYS.FRIDAY',
      'sábado': 'DAYS.SATURDAY',
      'domingo': 'DAYS.SUNDAY'
    };

    return mapaDias[dia.toLowerCase()] || dia;
  }

}
