import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from '../../share/services/api/ticket.service';
import { AuthService } from '../../share/services/api/auth.service';

@Component({
  selector: 'app-update-ticket-modal',
  standalone: false,
  templateUrl: './update-ticket-modal.html',
  styleUrl: './update-ticket-modal.css'
})
export class UpdateTicketModal {

  form!: FormGroup;
  imagenes: File[] = [];
  estadosDisponibles: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { ticketId: number; estadoActual: string },
    private dialogRef: MatDialogRef<UpdateTicketModal>,
    private fb: FormBuilder,
    private ticketService: TicketService,
    private authService: AuthService
  ) {

    this.form = this.fb.group({
      nuevoEstado: ['', Validators.required],
      observacion: ['', Validators.required],
      imagenes: [null]
    });

    this.cargarEstadosPermitidos();
  }

  cargarEstadosPermitidos() {
    const reglas: Record<string, string[]> = {
      PENDING: ['ASSIGNED'],
      ASSIGNED: ['IN_PROGRESS'],
      IN_PROGRESS: ['RESOLVED'],
      RESOLVED: ['CLOSED'],
      CLOSED: []
    };

    this.estadosDisponibles = reglas[this.data.estadoActual] || [];
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    this.imagenes = Array.from(files);
  }

  guardar() {
    if (this.form.invalid || this.imagenes.length === 0) return;

    const user = this.authService.usuario();
    if (!user) return;

    const formData = new FormData();
    formData.append('nuevoEstado', this.form.value.nuevoEstado);
    formData.append('observacion', this.form.value.observacion);
    formData.append('actorId', user.id);

    this.imagenes.forEach((file) => {
      formData.append('imagenes', file);
    });

    this.ticketService.updateStatus(this.data.ticketId, formData).subscribe({
      next: () => this.dialogRef.close('updated'),
      error: (err) => console.error('Error al actualizar ticket:', err)
    });
  }

  cerrar() {
    this.dialogRef.close();
  }
}
