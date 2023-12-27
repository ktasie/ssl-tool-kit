import 'dotenv/config';
process.on('uncaughtException', (err) => {
  console.log('💥', err);
  process.exit(1);
});

// eslint-disable-next-line semi
import app from './app.js';

const port = process.env.PORT || 3000;

// start webserver on $ports
const server = app.listen(`${port}`, () => {
  console.log(`🚴‍♂️ App is running on port ${port}`);
});

// Handle dangling unhandled promises
process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.log('💥', err);
  server.close(() => {
    process.exit(1);
  });
});
