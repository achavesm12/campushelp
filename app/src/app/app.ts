import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: false
})
export class App {

  constructor(
    private router: Router,
    private translate: TranslateService
  ) {
    this.translate.addLangs(['es', 'en']);
    this.translate.use('es');

    // 🔥 DETECTAR CAMBIOS DE RUTA CONFIABLES
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {

        // 🔍 Rutas antes y después de redirecciones
        const rawUrl = event.url || '';
        const finalUrl = event.urlAfterRedirects || '';

        // 🔥 Preferimos la ruta MÁS CORTA (si es /auth antes de redirigir)
        const url = rawUrl.length <= finalUrl.length ? rawUrl : finalUrl;

        console.log("➡️ RAW:", rawUrl);
        console.log("➡️ FINAL:", finalUrl);
        console.log("➡️ USANDO:", url);

        // 🔥 cualquier ruta del módulo auth
        const esAuth = url.startsWith('/auth');

        if (esAuth) {
          document.body.classList.add('no-layout');
        } else {
          document.body.classList.remove('no-layout');
        }
      });
  }
}
