import { Component, signal, computed } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { I18nService } from '../../share/services/app/i18n.service';
import { LayoutService } from '../../share/services/app/layout.service';

import { NotificacionApiService } from '../../share/services/api/notificacion-api.service';
import { NotificacionModel } from '../../share/models/notificacion.model';
import { AuthService } from '../../share/services/api/auth.service';


@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  // ============ VISIBILIDAD DEL HEADER ============
  mostrar = signal(true);

  // ============ USUARIO LOGUEADO ============
  usuarioActual = signal<any>(null);

  // ============ NOTIFICACIONES ============
  notificaciones = signal<NotificacionModel[]>([]);
  panelAbierto = signal(false);

  noLeidas = computed(() =>
    this.notificaciones().filter(n => !n.leida).length
  );

  constructor(
    private router: Router,
    private i18n: I18nService,
    public layout: LayoutService,
    private notifService: NotificacionApiService,
    private auth: AuthService
  ) { }

  // ============ INICIALIZACIÓN ============
  ngOnInit() {

    // Cargar usuario actual
    this.usuarioActual.set(this.auth.getUsuarioActual());

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {

        const url = event.urlAfterRedirects || event.url;

        const rutasOcultas = [
          '/auth',
          '/auth/',
          '/auth/login',
          '/auth/index',
          '/login'
        ];

        const esLogin = rutasOcultas.some(r => url.startsWith(r));

        this.mostrar.set(!esLogin);

        if (!esLogin && localStorage.getItem('token')) {
          this.cargarNotificaciones();
        }
      });
  }


  // ============ NOTIFICACIONES ============
  cargarNotificaciones() {
    this.notifService.get().subscribe({
      next: (data) => {
        this.notificaciones.set(data);
      },
      error: (err) => {
        console.error("Error cargando notificaciones", err);
      }
    });
  }

  togglePanel() {
    this.panelAbierto.set(!this.panelAbierto());
  }

  marcarComoLeida(n: NotificacionModel) {
    if (n.leida) return;

    this.notifService.marcarComoLeida(n.id).subscribe({
      next: () => {
        this.notificaciones.update(lista =>
          lista.map(item =>
            item.id === n.id ? { ...item, leida: true } : item
          )
        );
      }
    });
  }

  // 🔥 NUEVO: tipo legible
  tipoLegible(tipo: string) {
    const mapa: Record<string, string> = {
      LOGIN: "Inicio de sesión",
      TICKET_ASSIGNED: "Ticket asignado",
      TICKET_STATUS: "Cambio de estado",
      TICKET_CLOSED: "Ticket cerrado",
      TICKET_PROGRESS: "Actualización del ticket"
    };

    return mapa[tipo] ?? tipo;
  }

  // 🔥 NUEVO: íconos por tipo
  iconoPorTipo(tipo: string) {
    const icons: Record<string, string> = {
      LOGIN: "login",
      TICKET_ASSIGNED: "assignment_ind",
      TICKET_STATUS: "sync",
      TICKET_CLOSED: "check_circle",
      TICKET_PROGRESS: "pending"
    };

    return icons[tipo] ?? "notifications";
  }

  // 🔥 NUEVO: clases de estilo por tipo
  clasePorTipo(tipo: string) {
    const clases: Record<string, string> = {
      LOGIN: "notif-login",
      TICKET_ASSIGNED: "notif-assign",
      TICKET_STATUS: "notif-status",
      TICKET_CLOSED: "notif-closed",
      TICKET_PROGRESS: "notif-progress"
    };

    return clases[tipo] ?? "";
  }

  // 🔥 NUEVO: formato bonito de fecha
  formatearFecha(fecha: string | Date) {
    const f = new Date(fecha);
    const hoy = new Date();

    const esHoy =
      f.getDate() === hoy.getDate() &&
      f.getMonth() === hoy.getMonth() &&
      f.getFullYear() === hoy.getFullYear();

    if (esHoy) {
      return `Hoy, ${f.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })}`;
    }

    return f.toLocaleString('es-CR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }


  // ============ IDIOMA ============
  cambiarIdioma(lang: string) {
    this.i18n.cambiarIdioma(lang);
  }

  // ============ VISIBILIDAD ============
  mostrarHeader() {
    return this.mostrar();
  }

  mostrarFooter() {
    return this.mostrar();
  }

  // ============ UTILIDADES ============

  ordenarPorFecha() {
    return [...this.notificaciones()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // === AGRUPAR POR FECHAS ===
  agruparPorFecha(lista: NotificacionModel[]) {

    const grupos: any = {
      "Hoy": [],
      "Ayer": [],
      "Esta semana": [],
      "Más antiguas": []
    };

    const hoy = new Date();
    const AYER = new Date();
    AYER.setDate(hoy.getDate() - 1);

    const hace7 = new Date();
    hace7.setDate(hoy.getDate() - 7);

    for (const n of lista) {
      const fecha = new Date(n.createdAt);

      if (fecha.toDateString() === hoy.toDateString()) {
        grupos["Hoy"].push(n);

      } else if (fecha.toDateString() === AYER.toDateString()) {
        grupos["Ayer"].push(n);

      } else if (fecha >= hace7) {
        grupos["Esta semana"].push(n);

      } else {
        grupos["Más antiguas"].push(n);
      }
    }

    return grupos;
  }

  // Getter para usar en el HTML
  get gruposNotificaciones() {
    return this.agruparPorFecha(this.notificaciones());
  }

  grupos() {
    return [
      { nombre: "Hoy", items: this.gruposNotificaciones["Hoy"] },
      { nombre: "Ayer", items: this.gruposNotificaciones["Ayer"] },
      { nombre: "Esta semana", items: this.gruposNotificaciones["Esta semana"] },
      { nombre: "Más antiguas", items: this.gruposNotificaciones["Más antiguas"] },
    ];
  }

}
