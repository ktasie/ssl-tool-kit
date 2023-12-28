import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import morgan from 'morgan';

import sslRoutes from './routes/sslRoutes.js';
import viewRoutes from './routes/viewRoutes.js';
import globalErrorHandler from './controller/errorController.js';
import AppError from './utils/appError.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(helmet())
// app.use(xss())
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Routes
app.use('/', viewRoutes);
app.use('/api/v1', sslRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
