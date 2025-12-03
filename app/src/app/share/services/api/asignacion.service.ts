import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseAPI } from './base-api';
import { AsignacionModel } from '../../models/asignacion.model';
import { environment } from '../../../../environments/environment.development';
import { AsignacionVisualModel } from '../../models/asignacionVisual.model';

@Injectable({
    providedIn: 'root'
})
export class AsignacionService extends BaseAPI<AsignacionModel> {

    // === Signals para la vista manual ===
    ticketInfo = signal<any>(null);
    tecnicos = signal<any[]>([]);

    // === Para los resultados del autotriage ===
    resultadosAuto = signal<any[]>([]);

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.endPointAsignaciones);
    }

    // === LISTA VISUAL (index) ===
    getVisual() {
        return this.getCustom<AsignacionVisualModel[]>('visual');
    }

    // === Cargar técnicos para asignación manual ===
    cargarTecnicosDisponibles(idTicket: number) {
        this.getCustomById<any>('manual', idTicket).subscribe({
            next: (resp) => {
                this.ticketInfo.set(resp.ticket || null);
                this.tecnicos.set(resp.tecnicos || []);
            },
            error: (err) => {
                console.error("Error cargando técnicos:", err);
            }
        });
    }

    asignarManual(payload: any) {
        return this.postCustom<any>('manual', payload);
    }

    // === AUTOTRIAGE ===
    ejecutarAutotriage() {
        return this.postCustom<any>('automatico', {});
    }

    cargarAutotriage() {
        this.ejecutarAutotriage().subscribe({
            next: (resp) => {
                this.resultadosAuto.set(resp.resultados || []);
            },
            error: (err) => {
                console.error("Error en autotriage:", err);
                this.resultadosAuto.set([]);  // <-- evita undefined
            }
        });
    }
}
