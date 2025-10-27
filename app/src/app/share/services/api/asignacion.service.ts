import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseAPI } from './base-api';
import { AsignacionModel } from '../../models/asignacion.model';
import { environment } from '../../../../environments/environment.development';
import { AsignacionVisualModel } from '../../models/asignacionVisual.model';


@Injectable({
    providedIn: 'root'
})
export class AsignacionService extends BaseAPI<AsignacionModel> {
    constructor(httpClient: HttpClient) {
        super(httpClient, environment.endPointAsignaciones);
    }

    getVisual() {
        return this.getCustom<AsignacionVisualModel>();
    }

}
