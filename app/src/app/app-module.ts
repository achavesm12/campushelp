import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CoreModule } from './core/core-module';
import { ShareModule } from './share/share-module';
import { HomeModule } from './home/home-module';
import { UsuarioModule } from './usuario/usuario-module';
import { TecnicoModule } from './tecnicos/tecnico-module';
import { TicketModule } from './ticket/ticket-module';
import { AsignacionModule } from './asignacion/asignacion-module';
import { AppRoutingModule } from './app-routing-module';
import { CommonModule } from '@angular/common';

import { App } from './app';
import { NgxSonnerToaster } from 'ngx-sonner';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpErrorInterceptorService } from './share/interceptor/http-error-interceptor.service';

// traducción
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


import { AuthInterceptor } from './share/interceptor/auth.interceptor';



export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    App,
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    AppRoutingModule,
    CoreModule,
    ShareModule,
    HomeModule,
    UsuarioModule,
    TecnicoModule,
    TicketModule,
    AsignacionModule,
    NgxSonnerToaster,

    // traducción
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

  ],

  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptorsFromDi()),

    // Manejo de errores global
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true
    },

    // interceptor de autenticación (añade el token a cada request)
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],


  bootstrap: [App]
})
export class AppModule { }
