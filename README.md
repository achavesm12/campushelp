# CampusHelp

Sistema de gestión de tickets para soporte técnico en un entorno universitario.

## Tecnologías
- Angular (Frontend)
- Node.js + TypeScript (Backend)
- Prisma ORM
- MySQL
- Rest API

## Estructura del proyecto

campushelp/
├── app/        # Frontend (Angular)
├── server/     # Backend (Node + Prisma)
└── README.md

## Funcionalidades
- Creación y gestión de tickets
- Asignación manual y automática (autotriage)
- Historial de estados del ticket
- Gestión de técnicos
- Cálculo de SLA y cumplimiento
- Valoraciones y notificaciones

## Instalación y ejecución

### Frontend
```bash
cd app
npm install
ng serve
```

### Backend
```bash
cd server
npm install
npm run dev
```
