import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class I18nService {

    idiomaActual = signal('es');

    constructor(private translate: TranslateService) {

        translate.addLangs(['es', 'en']);

        const saved = localStorage.getItem('lang') ?? 'es';

        this.idiomaActual.set(saved);
        translate.use(saved); 
    }

    cambiarIdioma(lang: string) {
        this.idiomaActual.set(lang);
        this.translate.use(lang);
        localStorage.setItem('lang', lang);
    }
}
