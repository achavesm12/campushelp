import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { CoreModule } from './core/core-module';
import { ShareModule } from './share/share-module';
import { HomeModule } from './home/home-module';
import { UsuarioModule } from './usuario/usuario-module';
import { TecnicoModule } from './tecnico/tecnico-module';
import { CategoriaModule } from './categoria/categoria-module';
import { TicketModule } from './ticket/ticket-module';
import { AsignacionModule } from './asignacion/asignacion-module';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    ShareModule,
    HomeModule,
    UsuarioModule,
    TecnicoModule,
    CategoriaModule,
    TicketModule,
    AsignacionModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient()
  ],
  bootstrap: [App]
})
export class AppModule { }
