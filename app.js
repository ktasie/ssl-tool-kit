import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import morgan from 'morgan';

import sslRoutes from './routes/sslRoutes.js';
import viewRoutes from './routes/viewRoutes.js';
import errorController from './controller/errorController.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Routes

app.use('/', viewRoutes);
app.use('/api/v1', sslRoutes);

app.all('*', errorController);

const port = process.env.PORT || 3000;

// start webserver on $ports
app.listen(`${port}`, () => {
  console.log(`App is running on port ${port}`);
});