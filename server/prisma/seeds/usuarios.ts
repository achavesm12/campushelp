import { Role } from "../../generated/prisma";

export const usuarios = [
    // Administradores
    {
        nombre: "Administrador",
        email: "admin@gmail.com",
        password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
        role: Role.ADMIN,
    },
    {
        nombre: "Admin Soporte",
        email: "admin2@gmail.com",
        password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
        role: Role.ADMIN,
    },
    {
        nombre: "Admin General",
        email: "admin3@gmail.com",
        password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
        role: Role.ADMIN,
    },

    // Técnicos
    {
        nombre: "Tecnico 1",
        email: "tecnico1@gmail.com",
        password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
        role: Role.TECH,
    },
    {
        nombre: "Tecnico 2",
        email: "tecnico2@gmail.com",
        password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
        role: Role.TECH,
    },
    {
        nombre: "Tecnico 3",
        email: "tecnico3@gmail.com",
        password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
        role: Role.TECH,
    },

    // Clientes
    {
        nombre: "Ana María",
        email: "anamaria@gmail.com",
        password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
        role: Role.CLIENT,
    },
    {
        nombre: "Pedro López",
        email: "pedro@gmail.com",
        password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
        role: Role.CLIENT,
    },
    {
        nombre: "Luis Campos",
        email: "luis@gmail.com",
        password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
        role: Role.CLIENT,
    },
];
