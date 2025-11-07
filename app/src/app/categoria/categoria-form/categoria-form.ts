import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { CategoriaModel } from '../../share/models/categoria.model';
import { CategoriaService } from '../../share/services/api/categoria.service';
import { SlaService } from '../../share/services/api/sla.service';
import { EspecialidadService } from '../../share/services/api/especialidad.service';
import { NotificationService } from '../../share/services/app/notification.service';
import { SlaModel } from '../../share/models/sla.model';
import { EtiquetaModel } from '../../share/models/etiqueta.model';
import { EspecialidadModel } from '../../share/models/especialidad.model';

@Component({
  selector: 'app-categoria-form',
  standalone: false,
  templateUrl: './categoria-form.html',
  styleUrl: './categoria-form.css'
})
export class CategoriaForm implements OnInit, OnDestroy {
  //subject para controlar la destrucción de suscripciones y evitar memory leaks
  private destroy$ = new Subject<void>();

  //título del form, id de la categoria y bandera de creación/actualización
  titleForm = 'Crear';
  idCategoria: number | null = null;
  isCreate = true;

  //signals
  slaList = signal<SlaModel[]>([]);
  etiquetasList = signal<EtiquetaModel[]>([]);
  especialidadesList = signal<EspecialidadModel[]>([]);
  loading = signal<boolean>(false);

  categoriaForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private categoriaService: CategoriaService,
    private especialidadService: EspecialidadService,
    private noti: NotificationService
  ) { }

  ngOnInit(): void {
    this.initForm();

    //cargar sla 
    this.categoriaService.getSlas().pipe(takeUntil(this.destroy$)).subscribe({
      next: (slas) => this.slaList.set(slas),
      error: () => this.noti.error("Error", "No se pudieron cargar los SLA", 2000)
    });

    //cargar etiquetas
    this.categoriaService.getEtiquetas().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => this.etiquetasList.set(data),
      error: () => this.noti.error("Error", "No se pudieron cargar las etiquetas", 2000)
    });

    //cargar especialidades
    this.especialidadService.get().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => this.especialidadesList.set(data),
      error: () => this.noti.error("Error", "No se pudieron cargar las especialidades", 2000)
    });

    //crear o actualizar
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.idCategoria = params['id'] ? Number(params['id']) : null;
      this.isCreate = this.idCategoria === null;
      this.titleForm = this.isCreate ? 'Crear' : 'Actualizar';

      if (!this.isCreate && this.idCategoria) {
        this.loadCategoria();
      }
    });
  }

  //inicialiar el form
  private initForm(): void {
    this.categoriaForm = this.fb.group({
      id: [null],
      nombre: [null, [Validators.required, Validators.minLength(3)]],
      slaId: [null, [Validators.required]],
      etiquetas: [[], Validators.required],
      especialidades: [[], Validators.required],
      slaRespuestaMinutos: [null, [Validators.required, Validators.min(1)]],
      slaResolucionMinutos: [null, [Validators.required, Validators.min(1)]],
    });
  }

  //carga una categoria existente
  private loadCategoria(): void {
    this.loading.set(true);
    this.categoriaService.getById(this.idCategoria!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: CategoriaModel) => {
          this.patchFormValues(data); this.loading.set(false);
        },
        error: (err) => {
          console.error("Error cargando la categoría", err);
          this.loading.set(false);
          this.noti.error("Error", "No se cargó la categoría", 2000);
          this.router.navigate(['/categorias']);
        },
      });
  }

  private patchFormValues(data: CategoriaModel): void {
    this.categoriaForm.patchValue({
      id: data.id,
      nombre: data.nombre,
      slaId: data.slaId,
      etiquetas: data.etiquetas?.map(e => e.id) ?? [],
      especialidades: data.especialidades?.map(e => e.id) ?? [],
      slaRespuestaMinutos: data.sla?.maxRespuestaHrs ? data.sla?.maxRespuestaHrs * 60 : null,
      slaResolucionMinutos: data.sla?.maxResolucionHrs ? data.sla?.maxResolucionHrs * 60 : null,
    });
  }

  //enviar el form al backend
  submitCategorias(): void {
    this.categoriaForm.markAllAsTouched();

    if (this.categoriaForm.invalid) {
      this.noti.error("Formulario inválido", "Revise los campos", 2000);
      return;
    }

    const form = this.categoriaForm.getRawValue();

    // Validación: resolución > respuesta
    if (form.slaResolucionMinutos <= form.slaRespuestaMinutos) {
      this.noti.error("Validación", "El tiempo de resolución debe ser mayor al de respuesta", 2000);
      return;
    }

    const payload = {
      ...form,
      etiquetas: form.etiquetas || [],
      especialidades: form.especialidades || [],
    }

    this.loading.set(true);

    const request$ = this.isCreate
      ? this.categoriaService.create(payload)
      : this.categoriaService.update({ ...payload, id: this.idCategoria });

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.loading.set(false);
        this.noti.success(this.isCreate ? 'Categoría creada' : 'Categoría actualizada',
          `${data.nombre}`, 2000, '/categorias');
      },
      error: (error) => {
        this.loading.set(false);
        const msg =
          error?.error?.message ||
          (typeof error?.error === 'string' ? error.error : null) ||
          'Error al guardar la categoría';
        this.noti.error('Error', msg, 2000);
      },
    });
  }

  //reinicia el formulario
  onReset(): void {
    this.categoriaForm.reset({
      id: null,
      nombre: null,
      slaId: null,
      etiquetas: [],
      especialidades: [],
      slaRespuestaMinutos: null,
      slaResolucionMinutos: null
    });
  }

  //vuelve al listado
  onBack(): void {
    this.router.navigate(["/categorias"]);
  }

  //limpia las suscripciones
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  };

  //helper validación del template
  hasError(ctrl: string, error: string): boolean {
    const c = this.categoriaForm.get(ctrl);
    return !!c && c.touched && c.hasError(error);
  };
} 
