import express from 'express';
import csrGenerator from '../controller/csrController.js';

const router = express.Router();

router.route('/csr').post(csrGenerator);

router.route('/convertPFX').post((req, res, next) => {
  res.send('hello world');
});

router.route('/certMatch').post((req, res, next) => {
  res.send('hello world');
});

export default router;
