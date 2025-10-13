import express, { Express } from 'express';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { ErrorMiddleware } from './middleware/error.middleware';
import { AppRoutes } from './routes/routes'; // asegúrate de tener tu archivo de rutas
import { TecnicoRoutes } from './routes/tecnico.routes';

const app: Express = express();

// Cargar variables de entorno
dotenv.config();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // permite llamadas externas
app.use(morgan('dev')); // log de requests
app.use(express.json()); // parsea JSON
app.use(express.urlencoded({ extended: true })); // parsea form-urlencoded

// ---- Registro de rutas ----
app.use(AppRoutes.routes); 
//app.use(TecnicoRoutes.routes); 


// Middleware de manejo de errores
app.use(ErrorMiddleware.handleError);

// Servir imágenes si lo necesitas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log('Presione CTRL-C para detenerlo\n');
});



/* import express, { Express } from 'express';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { ErrorMiddleware } from './middleware/error.middleware';
// Asegúrate de tener este middleware o crea uno mínimo
//import { ErrorMiddleware } from './middleware/error.middleware';

// Inicializa Express
const app: Express = express();

// Configuración de variables de entorno
dotenv.config();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permitir llamadas externas
app.use(morgan('dev')); // Log de requests
app.use(express.json()); // Parseo JSON
app.use(express.urlencoded({ extended: true })); // Parseo form-urlencoded

// ------------------- Rutas -------------------
// Aquí agregarás tus rutas de usuarios, tickets, etc.
// Ejemplo de rutas de prueba:

app.get('/usuarios', async (req, res) => {
    res.json({ message: 'Lista de usuarios de prueba' });
});

app.get('/tickets', async (req, res) => {
    res.json({ message: 'Lista de tickets de prueba' });
});

// Aquí podrías agregar POST, PATCH, DELETE según tus controladores

// Middleware de manejo de errores
app.use(ErrorMiddleware.handleError);

// Servir imágenes si lo necesitas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log('Presione CTRL-C para detenerlo\n');
});
 */