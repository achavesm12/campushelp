import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

/**
 * Todas las entidades deben tener al menos un ID opcional
 */
export interface BaseEntity {
  id?: number;
}

@Injectable({
  providedIn: 'root',
})
export class BaseAPI<T extends BaseEntity> {

  /** URL base del API (definida en environment.ts) */
  urlAPI: string = environment.apiURL;

  constructor(
    protected http: HttpClient,
    /**
     * Nombre del recurso (por ejemplo: 'tickets', 'categorias')
     */
    @Inject(String) protected endpoint: string
  ) { }

  // ============================================================
  // MÉTODOS CRUD BÁSICOS
  // ============================================================

  /** GET /endpoint */
  get(): Observable<T[]> {
    return this.http.get<T[]>(`${this.urlAPI}/${this.endpoint}`);
  }

  /** GET /endpoint/id */
  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.urlAPI}/${this.endpoint}/${id}`);
  }

  /** POST /endpoint */
  create(item: Partial<T>): Observable<T> {
    return this.http.post<T>(`${this.urlAPI}/${this.endpoint}`, item);
  }

  /** PUT /endpoint/id */
  update(item: Partial<T>): Observable<T> {
    return this.http.put<T>(`${this.urlAPI}/${this.endpoint}/${item.id}`, item);
  }

  /** DELETE /endpoint/id */
  delete(item: T): Observable<T> {
    return this.http.delete<T>(`${this.urlAPI}/${this.endpoint}/${item.id}`);
  }

  // ============================================================
  // MÉTODOS PERSONALIZADOS (GENÉRICOS)
  // ============================================================

  /**
   * GET /endpoint/action
   */
  getMethod(
    action: string,
    options: { [param: string]: unknown } = {}
  ): Observable<T | T[]> {
    return this.http.get<T[]>(
      `${this.urlAPI}/${this.endpoint}/${action}`,
      options
    );
  }

  /**
   * GET /endpoint/action (devuelve tipo U)
   */
  getCustom<U>(action: string): Observable<U> {
    return this.http.get<U>(`${this.urlAPI}/${this.endpoint}/${action}`);
  }

  /**
   * GET /endpoint/action/id
   */
  getCustomById<U>(action: string, id: number | string): Observable<U> {
    return this.http.get<U>(`${this.urlAPI}/${this.endpoint}/${action}/${id}`);
  }

  /**
   * POST /endpoint/action
   */
  postCustom<U>(action: string, body: any): Observable<U> {
    return this.http.post<U>(`${this.urlAPI}/${this.endpoint}/${action}`, body);
  }

  /**
   * POST /endpoint (para valoraciones u otros casos especiales)
   */
  createForTicket(data: any): Observable<T> {
    return this.http.post<T>(`${this.urlAPI}/${this.endpoint}`, data);
  }

  // ============================================================
  // MÉTODOS ESPECIALES SEGÚN LÓGICA DEL SISTEMA
  // ============================================================

  /**
   * GET /etiquetas (fuera del endpoint actual)
   */
  getEtiquetas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlAPI}/etiquetas`);
  }

  /**
   * GET /sla (fuera del endpoint actual)
   */
  getSlas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlAPI}/sla`);
  }

  /**
   * GET /etiquetas/id/categoria
   */
  getCategoriaPorEtiqueta(etiquetaId: number): Observable<any> {
    return this.http.get<any>(`${this.urlAPI}/etiquetas/${etiquetaId}/categoria`);
  }

  // ============================================================
  // MÉTODOS PARA PUT/PATCH CON FORM-DATA
  // ============================================================

  /**
   * PUT /endpoint/path con FormData
   */
  putFormData(path: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.urlAPI}/${this.endpoint}/${path}`, formData);
  }

  /**
   * PATCH /endpoint/id/estado  (actualizar estado del ticket)
   */
  updateStatus(id: number, data: FormData) {
    return this.http.patch(
      `${this.urlAPI}/${this.endpoint}/${id}/estado`,
      data
    );
  }

  // ============================================================
  // MÉTODOS ESPECÍFICOS PARA RELACIONES USUARIO–ROL
  // ============================================================

  /**
   * GET /endpoint?idUsuario=x&role=y
   */
  getByUsuarioYRol(idUsuario: number, rol: string): Observable<T[]> {
    const params = {
      idUsuario: idUsuario.toString(),
      role: rol,
    };
    return this.http.get<T[]>(`${this.urlAPI}/${this.endpoint}`, { params });
  }

  /**
   * GET /endpoint/ticket/:id
   */
  getByTicket(ticketId: number): Observable<T> {
    return this.http.get<T>(`${this.urlAPI}/${this.endpoint}/ticket/${ticketId}`);
  }
}
