import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../share/services/api/auth.service';

@Component({
  selector: 'app-auth-index',
  standalone: false,
  templateUrl: './auth-index.html',
  styleUrls: ['./auth-index.css']
})
export class AuthIndex {

  email = signal('');
  password = signal('');

  cargando = signal(false);
  error = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login() {
    this.cargando.set(true);
    this.error.set(null);

    this.authService.login(this.email(), this.password()).subscribe({
      next: (resp) => {
        this.cargando.set(false);
        this.router.navigate(['/inicio']);  // Redirige al dashboard
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set(err.error?.message || 'Credenciales incorrectas');
      }
    });
  }

}
