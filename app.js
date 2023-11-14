//import express from 'express';

import sslTools from './model/sslTools.js';
//const sslTools = require('./model/sslTools');

//const app = express();

//Middleware to accept json payload
//app.use(express.json());

//Routes.
const tools = new sslTools();

//const a = await tools._generateUnencryptedPrivatekey();
//const a = await tools.generateCSR('NG', 'FCT', 'Abuja', 'GBB', 'Cloud Ops', 'example.com', 'ktasie@gmail.com');
const a = await tools.generateCSR('NG', 'FCT', 'Abuja', 'GBB', 'Cloud Ops', 'example.com', 'ktasie@gmail.com');
console.log(tools);
//console.log(cmd, key);
// app.listen('3000', () => {
//   console.log('App is running on port 3000');
// });
