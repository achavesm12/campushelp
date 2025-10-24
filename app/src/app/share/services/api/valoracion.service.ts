import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseAPI } from './base-api';
import { ValoracionModel } from '../../models/valoracion.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class ValoracionService extends BaseAPI<ValoracionModel> {
    constructor(httpClient: HttpClient) {
        super(httpClient, environment.endPointValoraciones);
    }
}
