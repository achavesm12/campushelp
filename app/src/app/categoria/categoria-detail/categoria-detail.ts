import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../../share/services/api/categoria.service';
import { CategoriaModel } from '../../share/models/categoria.model';

@Component({
  selector: 'app-categoria-detail',
  standalone: false,
  templateUrl: './categoria-detail.html',
  styleUrls: ['./categoria-detail.css'] // ✅ plural y con "s"
})
export class CategoriaDetail {
  // Signal para almacenar la categoría
  categoria = signal<CategoriaModel | null>(null);

  constructor(
    private route: ActivatedRoute,
    private categoriaService: CategoriaService,
    private router: Router
  ) {
    this.cargarDetalle();
  }

  cargarDetalle() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.categoriaService.getById(id).subscribe({
        next: (resp) => this.categoria.set(resp),
        error: (err) => {
          console.error('Error al cargar categoría:', err);
          this.categoria.set(null);
        }
      });
    } else {
      this.categoria.set(null);
    }
  }

  goBack() {
    this.router.navigate(['/categorias']);
  }
}
