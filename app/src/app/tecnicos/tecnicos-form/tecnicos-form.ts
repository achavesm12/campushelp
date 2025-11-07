import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { pipe, Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { TecnicoModel } from '../../share/models/tecnico.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TecnicoService } from '../../share/services/api/tecnico.service';
import { EspecialidadService } from '../../share/services/api/especialidad.service';
import { NotificationService } from '../../share/services/app/notification.service';
import { EspecialidadModel } from '../../share/models/especialidad.model';

@Component({
  selector: 'app-tecnicos-form',
  standalone: false,
  templateUrl: './tecnicos-form.html',
  styleUrl: './tecnicos-form.css'
})
export class TecnicosForm implements OnInit, OnDestroy {

  //subject para controlar la destrucción de suscripciones y evitar memory leaks
  private destroy$ = new Subject<void>();

  //título del form, id del técnico y bandera de creación/actualización
  titleForm = 'Crear';
  idTecnico: number | null = null;
  isCreate = true;

  //lista de especialidades con angular 20 y signals
  espList = signal<EspecialidadModel[]>([]);
  loading = signal<boolean>(false);

  //form reactivo
  tecnicoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private tecnicoService: TecnicoService,
    private espService: EspecialidadService,
    private noti: NotificationService
  ) { }


  /**
   * Ciclo de vida OnInit: inicializa el formulario, carga listas y verifica si es actualización
   */
  ngOnInit(): void {
    this.initForm();

    console.log('🟣 Iniciando formulario de técnico...');

    this.espService.get().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        console.log('🟢 Especialidades cargadas desde API:', data);
        this.espList.set(data);

        this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
          this.idTecnico = params['id'] ? Number(params['id']) : null;
          this.isCreate = this.idTecnico === null;
          this.titleForm = this.isCreate ? 'Crear' : 'Actualizar';

          console.log('Parámetros de ruta ->', params);
          console.log('Modo de formulario ->', this.isCreate ? 'CREAR' : 'EDITAR');

          if (!this.isCreate && this.idTecnico) {
            this.loading.set(true);
            console.log('⏳ Cargando técnico con ID:', this.idTecnico);

            this.tecnicoService.getById(this.idTecnico)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (data: TecnicoModel) => {
                  console.log('Datos del técnico recibidos:', data);

                  this.patchFormValues(data);
                  console.log('🧩 Formulario después del patch:', this.tecnicoForm.value);

                  this.loading.set(false);
                },
                error: (err) => {
                  console.error('Error cargando técnico:', err);
                  this.loading.set(false);
                  this.noti.error("Error", "No se pudo cargar el técnico", 4000);
                  this.router.navigate(['/tecnicos']);
                },
              });
          }
        });
      },
      error: (err) => {
        console.error('Error cargando especialidades:', err);
        this.noti.error("Error", "No se pudieron cargar las especialidades", 4000);
      }
    });
  }


  private initForm(): void {
    this.tecnicoForm = this.fb.group({
      id: [null],
      nombre: [null, [Validators.required, Validators.minLength(2)]],
      email: [null, [Validators.required, Validators.email]],
      disponibilidad: [true, Validators.required],
      especialidades: [[], Validators.required],
      cargaActual: [{ value: 0, disabled: true }]
    });
  }

  /*
  * Carga los valores del form con los datos del técnico 
  */
  private patchFormValues(data: TecnicoModel): void {
    this.tecnicoForm.patchValue({
      id: data.id,
      nombre: data.nombre,
      email: data.email,
      disponibilidad: data.disponibilidad,
      especialidades: data.especialidades?.map(e => e.id) ?? [],
      cargaActual: data.cargaActual ?? 0,
    });
  }

  /**
   * Envía el formulario: valida y guarda/actualiza el técnico
   */
  submitTecnico(): void {
    this.tecnicoForm.markAllAsTouched();

    if (this.tecnicoForm.invalid) {
      this.noti.error("Formulario inválido", "Revise los campos", 4000);
      return;
    }

    const form = this.tecnicoForm.getRawValue();
    const payload: Partial<TecnicoModel> = {
      ...form,
      especialidades: (form.especialidades || []).map((id: number) => ({ id })),
    }

    this.loading.set(true);

    const request$ = this.isCreate ? this.tecnicoService.create(payload) : this.tecnicoService.update(payload);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.loading.set(false);
        this.noti.success(this.isCreate ? 'Técnico creado' : 'Técnico actualizado', `${data.nombre}`, 3000, '/tecnicos');
      },
      error: (error) => {
        this.loading.set(false);

        const msg =
          error?.error?.message ||
          (typeof error?.error === 'string' ? error.error : null) ||
          'Error al guardar';

        this.noti.error('Error', msg, 4000);

      },
    });
  }

  /*
  * Resetear el form a los valores iniciales
  */
  onReset() {
    this.tecnicoForm.reset({
      id: null,
      nombre: null,
      email: null,
      disponibilidad: true,
      especialidades: [],
      cargaActual: { value: 0, disabled: true },
    });
  }

  /**
 * Navega de regreso a la lista de videojuegos
 */
  onBack(): void {
    this.router.navigate(['/tecnicos']);
  }

  /**
  * Ciclo de vida OnDestroy: limpia suscripciones
  */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /*
  * Helpers de validación para el template
  */
  hasError(ctrl: string, error: string): boolean {
    const c = this.tecnicoForm.get(ctrl);
    return !!c && c.touched && c.hasError(error);
  }

}
