import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseAPI } from './base-api';

import { environment } from '../../../../environments/environment.development';
import { NotificacionModel } from '../../models/notificacion.model';

@Injectable({
    providedIn: 'root'
})
export class NotificacionApiService extends BaseAPI<NotificacionModel> {

    constructor(http: HttpClient) {
        super(http, environment.endPointNotificaciones);
    }

    /** GET /notificaciones/count */
    contarNoLeidas() {
        return this.http.get<{ count: number }>(`${this.urlAPI}/${this.endpoint}/count`);
    }

    /** PATCH /notificaciones/:id/read */
    marcarComoLeida(id: number) {
        return this.http.patch(`${this.urlAPI}/${this.endpoint}/${id}/read`, {});
    }
}
