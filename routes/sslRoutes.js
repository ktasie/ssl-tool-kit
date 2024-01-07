import express from 'express';
import { body } from 'express-validator';
import generateCSR from '../controller/csrController.js';
import { convertPemToPfx, cpUpload } from '../controller/convertController.js';
import { matchKeyToCert } from '../controller/matchController.js';

const router = express.Router();

// SSL backend routes
router.route('/csr').post(generateCSR);
router.route('/pem/pfx12').post(cpUpload, convertPemToPfx);

const validate = [
  body('key').trim().notEmpty().withMessage('You must paste the content of a key file'),
  body('certificate').trim().notEmpty().withMessage('You must paste the content of a certificate file')
];
router.route('/match/key/cert').post(validate, matchKeyToCert);

export default router;
