import { Component, signal } from '@angular/core';
import { CategoriaModel } from '../../share/models/categoria.model';
import { CategoriaService } from '../../share/services/api/categoria.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categorias-index',
  standalone: false,
  templateUrl: './categoria-index.html',
  styleUrl: './categoria-index.css'
})
export class CategoriasIndex {
  datos = signal<CategoriaModel[]>([]);

  constructor(
    private categoriaService: CategoriaService,
    private router: Router
  ) {
    this.listarCategorias();
  }

  listarCategorias() {
    this.categoriaService.get().subscribe((respuesta: CategoriaModel[]) => {
      console.log('✅ Categorías desde API:', respuesta);
      this.datos.set(respuesta);
    });
  }

  detalle(id: number) {
    this.router.navigate(['/categorias', id]);
  }

  nuevaCategoria(): void {
    this.router.navigate(['/categorias/form']);
  }

  editar(id: number): void {
    this.router.navigate([`/categorias/form/${id}`]);
  }
}
