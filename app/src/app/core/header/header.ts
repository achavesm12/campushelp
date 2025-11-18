import { Component } from '@angular/core';
import { I18nService } from '../../share/services/app/i18n.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  constructor(private i18n: I18nService) { }

  cambiarIdioma(lang: string) {
    this.i18n.cambiarIdioma(lang);
  }
}
