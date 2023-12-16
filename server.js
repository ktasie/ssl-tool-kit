import 'dotenv/config';
import app from './app.js';

const port = process.env.PORT || 3000;

// start webserver on $ports
const server = app.listen(`${port}`, () => {
  console.log(`App is running on port ${port}`);
});

// Handle dangling unhandled promises
process.on('unhandledRejection', (err) => {
  console.log(':fire:', err);
  server.close(() => {
    process.exit(1);
  });
});
