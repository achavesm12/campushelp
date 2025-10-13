import { Role } from "../../generated/prisma";

export const usuarios = [
    // Admin
    {
        nombre: "Administrador",
        email: "admin@campushelp.com",
        password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
        role: Role.ADMIN,
    },
    // Técnico
    {
        nombre: "Tecnico1",
        email: "tecnico1@campushelp.com",
        password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
        role: Role.TECH,
    },
    // Cliente 1
    {
        nombre: "UsuarioCliente1",
        email: "cliente1@campushelp.com",
        password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
        role: Role.CLIENT,
    },
    // Cliente 2
    {
        nombre: "UsuarioCliente2",
        email: "cliente2@campushelp.com",
        password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
        role: Role.CLIENT,
    },
];
