import express from 'express';

import sslRoutes from './routes/sslRoutes.js';
import errorController from './controller/errorController.js';

const app = express();

//Middleware to accept json based payload
app.use(express.json());


// Routes
app.use('/api/v1', sslRoutes);
app.all('*', errorController);

const port = process.env.PORT || 3000;

app.listen('3000', () => {
  console.log(`App is running on port ${port}`);
});
