import { Component, OnInit, signal } from '@angular/core';
import { AsignacionService } from '../../share/services/api/asignacion.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-asignacion-autotriage',
  standalone: false,
  templateUrl: './asignacion-autotriage.html',
  styleUrls: ['./asignacion-autotriage.css']
})
export class AsignacionAutotriage implements OnInit {

  cargando = signal<boolean>(false);

  resultado: any;


  constructor(
    private asignacionService: AsignacionService,
    private snack: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {

    // 🔥 Aquí guardamos directamente el SIGNAL del servicio
    this.resultado = this.asignacionService.resultadosAuto;

    this.ejecutar();
  }

  ejecutar() {
    this.cargando.set(true);

    // 🚀 Llamamos al servicio para cargar los resultados
    this.asignacionService.cargarAutotriage();

    // Pequeño delay visual
    setTimeout(() => {
      this.cargando.set(false);

      this.snack.open(
        "Autotriage ejecutado correctamente",
        "OK",
        { duration: 3000, panelClass: ['snackbar-success'] }
      );
    }, 600);
  }

  volver() {
    this.router.navigate(['/asignaciones']);
  }
}
