import express, { Express } from 'express';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { ErrorMiddleware } from './middleware/error.middleware';
import { AppRoutes } from './routes/routes'; // asegúrate de tener tu archivo de rutas

//Recordar
//import "./config/passport";


const rootDir = __dirname;

const app: Express = express()

// Acceder a la configuracion del archivo .env
dotenv.config();
// Puerto que escucha por defecto 3000 o definido .env
const port = process.env.PORT || 3000;
// Middleware CORS para aceptar llamadas en el servidor
app.use(cors());
// Middleware para loggear las llamadas al servidor
app.use(morgan('dev'));

// Middleware para gestionar Requests y Response json
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

//---- Registro de rutas ----
app.use(AppRoutes.routes)

//Gestión de errores middleware
app.use(ErrorMiddleware.handleError)

//Acceso a las imágenes
app.use("/images", express.static(
    path.join(path.resolve(), "assets/uploads")))

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
    console.log('Presione CTRL-C para deternerlo\n');
});


/* const app: Express = express();

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
/*app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log('Presione CTRL-C para detenerlo\n');
});
 */
