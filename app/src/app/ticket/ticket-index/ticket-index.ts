import { RoleEnum } from '../../share/enums/rol.enum';
import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../../share/services/api/ticket.service';

@Component({
  selector: 'app-ticket-index',
  standalone: false,
  templateUrl: './ticket-index.html',
  styleUrl: './ticket-index.css'
})
export class TicketIndex implements OnInit {
  tickets = signal<any[]>([]);

  //**ids técnicos: 4, 5, 6 **
  //idUsuarioActual: number = 5; //tecnico 
  //rolUsuario: RoleEnum = RoleEnum.TECH;

  idUsuarioActual: number = 1; //admin
  rolUsuario: RoleEnum = RoleEnum.ADMIN;

  //idUsuarioActual: number = 9; //cliente  
  //rolUsuario: RoleEnum = RoleEnum.CLIENT;

  constructor(
    private ticketService: TicketService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarTickets();
  }

  cargarTickets(): void {
    this.ticketService.getByUsuarioYRol(this.idUsuarioActual, this.rolUsuario)
      .subscribe((data: any[]) => {
        let filtrados: any[] = [];

        switch (this.rolUsuario) {
          case 'ADMIN':
            filtrados = data;
            break;
          case 'CLIENT':
            filtrados = data.filter(t => t.solicitante?.id === this.idUsuarioActual);
            break;
          case 'TECH':
            filtrados = data.filter(t => t.asignacion?.usuarioId === this.idUsuarioActual);
            break;
        }

        this.tickets.set(filtrados);
      });
  }

  verDetalle(id: number): void {
    this.router.navigate(['/tickets', id]);
  }
}
