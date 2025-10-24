import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TecnicoService } from '../../share/services/api/tecnico.service';
import { TecnicoModel } from '../../share/models/tecnico.model';

@Component({
  selector: 'app-tecnicos-detail',
  standalone: false,
  templateUrl: './tecnicos-detail.html',
  styleUrl: './tecnicos-detail.css'
})
export class TecnicosDetail {
  // Signal para almacenar el técnico
  tecnico = signal<TecnicoModel | null>(null);

  constructor(
    private route: ActivatedRoute,
    private tecnicoService: TecnicoService,
    private router: Router
  ) {
    this.cargarDetalle();
  }

  cargarDetalle() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.tecnicoService.getById(id).subscribe({
        next: (resp) => this.tecnico.set(resp),
        error: (err) => {
          console.error('Error al cargar técnico:', err);
          this.tecnico.set(null);
        }
      });
    } else {
      this.tecnico.set(null);
    }
  }

  goBack() {
    this.router.navigate(['/tecnicos']);
  }
}
