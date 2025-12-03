import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private apiUrl = 'http://localhost:3000/auth';

    usuario = signal<any>(null);
    authToken = signal<string | null>(null);

    constructor(private http: HttpClient) {
        this.cargarStorage();
    }

    login(email: string, password: string) {
        return this.http.post(`${this.apiUrl}/login`, { email, password })
            .pipe(
                tap((resp: any) => {
                    this.authToken.set(resp.token);
                    this.usuario.set(resp.usuario);

                    localStorage.setItem('token', resp.token);
                    localStorage.setItem('usuario', JSON.stringify(resp.usuario));
                })
            );
    }

    cargarStorage() {
        const t = localStorage.getItem('token');
        const u = localStorage.getItem('usuario');

        if (t && u) {
            this.authToken.set(t);
            this.usuario.set(JSON.parse(u));
        }
    }

    logout() {
        this.authToken.set(null);
        this.usuario.set(null);
        localStorage.clear();
    }

    getUsuarioActual() {
        const data = localStorage.getItem('usuario');
        if (!data) return null;

        try {
            return JSON.parse(data);
        } catch {
            return null;
        }
    }

}
