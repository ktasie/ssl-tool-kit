import app from './app.js';

const port = process.env.PORT || 3000;

// start webserver on $ports
app.listen(`${port}`, () => {
  console.log(`App is running on port ${port}`);
});
