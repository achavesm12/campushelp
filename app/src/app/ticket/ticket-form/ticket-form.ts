import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { NotificationService } from '../../share/services/app/notification.service';
import { TicketService } from '../../share/services/api/ticket.service';

import { EtiquetaModel } from '../../share/models/etiqueta.model';
import { CategoriaModel } from '../../share/models/categoria.model';

import { EtiquetaService } from '../../share/services/api/etiqueta.service';
import { PrioridadModel } from '../../share/models/prioridad.model';
import { PrioridadService } from '../../share/services/api/prioridad.service';
import { UsuarioService } from '../../share/services/api/usuario.service';

@Component({
  selector: 'app-ticket-form',
  standalone: false,
  templateUrl: './ticket-form.html',
  styleUrl: './ticket-form.css'
})
export class TicketForm implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  titleForm = 'TICKETS.FORM.TITLE_CREATE';
  loading = signal<boolean>(false);

  // listas
  etiquetasList = signal<EtiquetaModel[]>([]);
  etiquetasFiltradas = signal<EtiquetaModel[]>([]);
  prioridadesList = signal<PrioridadModel[]>([]);

  // búsqueda de etiqueta
  busquedaEtiqueta = signal<string>('');

  // categoría calculada
  categoriaSeleccionada = signal<CategoriaModel | null>(null);

  // usuario solicitante (temporal)
  private solicitanteId = 3;

  ticketForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private etiquetaService: EtiquetaService,
    private prioridadService: PrioridadService,
    private ticketService: TicketService,
    private usuarioService: UsuarioService,
    private noti: NotificationService
  ) { }

  ngOnInit(): void {
    this.initForm();

    // cargar solicitante
    this.usuarioService.getById(this.solicitanteId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.ticketForm.patchValue({
            solicitanteNombre: user.nombre,
            solicitanteEmail: user.email
          });

          this.ticketForm.get('solicitanteNombre')?.disable();
          this.ticketForm.get('solicitanteEmail')?.disable();
        },
        error: () => {
          this.noti.error("Error", "No se pudo cargar el solicitante", 2000);
        }
      });

    // cargar etiquetas
    this.etiquetaService.get()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.etiquetasList.set(data);
          this.etiquetasFiltradas.set(data); // inicialmente todas
        },
        error: () =>
          this.noti.error("Error", "No se pudieron cargar las etiquetas", 2000)
      });

    // cargar prioridades
    this.prioridadService.get()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.prioridadesList.set(data),
        error: () =>
          this.noti.error("Error", "No se pudieron cargar las prioridades", 2000)
      });
  }

  private initForm(): void {
    this.ticketForm = this.fb.group({
      titulo: [null, [Validators.required, Validators.minLength(5)]],
      descripcion: [null, [Validators.required, Validators.minLength(5)]],
      prioridadId: [null, Validators.required],
      etiquetaId: [null, Validators.required],
      solicitanteNombre: [{ value: null, disabled: true }],
      solicitanteEmail: [{ value: null, disabled: true }],
      categoriaNombre: [{ value: null, disabled: true }],
      solicitanteId: [this.solicitanteId],
    });
  }

  // 🔎 cuando el usuario escribe en el input de etiqueta
  onBuscarEtiqueta(texto: string) {
    this.busquedaEtiqueta.set(texto);

    const t = texto.toLowerCase().trim();
    const lista = this.etiquetasList();

    // si no hay texto, mostrar todas
    if (!t) {
      this.etiquetasFiltradas.set(lista);
      return;
    }

    this.etiquetasFiltradas.set(
      lista.filter(e => e.nombre.toLowerCase().includes(t))
    );
  }

  // cuando selecciona una etiqueta de la lista
  seleccionarEtiqueta(e: EtiquetaModel) {
    this.ticketForm.patchValue({ etiquetaId: e.id });
    this.busquedaEtiqueta.set(e.nombre);   // mostrar el nombre en el input
    this.loadCategoriaPorEtiqueta(e.id);   // actualizar categoría
  }

  private loadCategoriaPorEtiqueta(etiquetaId: number): void {
    this.loading.set(true);

    this.etiquetaService.getCategoriaPorEtiqueta(etiquetaId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categoria) => {
          this.categoriaSeleccionada.set(categoria);
          this.ticketForm.patchValue({ categoriaNombre: categoria.nombre });
          this.loading.set(false);
        },
        error: () => {
          this.categoriaSeleccionada.set(null);
          this.ticketForm.patchValue({ categoriaNombre: null });
          this.loading.set(false);
          this.noti.error("Error", "No se pudo obtener la categoría", 2000);
        }
      });
  }

  submitTicket(): void {
    this.ticketForm.markAllAsTouched();

    if (this.ticketForm.invalid) {
      this.noti.error("Formulario inválido", "Revise los campos", 2000);
      return;
    }

    if (!this.categoriaSeleccionada()) {
      this.noti.error("Categoría no válida", "Debe seleccionar una etiqueta válida", 2000);
      return;
    }

    const form = this.ticketForm.getRawValue();

    const payload = {
      titulo: form.titulo,
      descripcion: form.descripcion,
      prioridadId: form.prioridadId,
      etiquetaId: form.etiquetaId,
      solicitanteId: this.solicitanteId
    };

    this.loading.set(true);

    this.ticketService.create(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.noti.success("Ticket creado", "Se registró correctamente", 2000, '/tickets');
        },
        error: (error) => {
          this.loading.set(false);
          const msg = error?.error?.message || "Error al crear ticket";
          this.noti.error("Error", msg, 2000);
        }
      });
  }

  onReset(): void {
    const solicitante = this.ticketForm.getRawValue().solicitanteNombre;
    const correo = this.ticketForm.getRawValue().solicitanteEmail;

    this.ticketForm.reset({
      titulo: null,
      descripcion: null,
      prioridadId: null,
      etiquetaId: null,
      categoriaNombre: null,
      solicitanteNombre: solicitante,
      solicitanteEmail: correo,
      solicitanteId: this.solicitanteId
    });

    this.categoriaSeleccionada.set(null);
    this.busquedaEtiqueta.set('');
    this.etiquetasFiltradas.set(this.etiquetasList());
  }

  onBack(): void {
    this.router.navigate(['/tickets']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  hasError(ctrl: string, error: string): boolean {
    const c = this.ticketForm.get(ctrl);
    return !!c && c.touched && c.hasError(error);
  }

}
