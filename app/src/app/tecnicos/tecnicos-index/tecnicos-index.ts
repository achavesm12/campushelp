import { Component, signal } from '@angular/core';
import { TecnicoModel } from '../../share/models/tecnico.model';
import { TecnicoService } from '../../share/services/api/tecnico.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tecnicos-index',
  standalone: false,
  templateUrl: './tecnicos-index.html',
  styleUrl: './tecnicos-index.css'
})
export class TecnicosIndex {
  datos = signal<TecnicoModel[]>([]);

  constructor(
    private tecnicoService: TecnicoService,
    private router: Router
  ) {
    this.listarTecnicos();
  }

  listarTecnicos() {
    this.tecnicoService.get().subscribe((respuesta: TecnicoModel[]) => {
      console.log('✅ Técnicos desde API:', respuesta);
      this.datos.set(respuesta);
    });
  }

  detalle(id: number) {
    this.router.navigate(['/tecnicos', id]);
  }

  nuevoTecnico(): void {
    this.router.navigate(['/tecnicos/form']);
  }

  editar(id: number): void {
  this.router.navigate([`/tecnicos/form/${id}`]);
}

}
