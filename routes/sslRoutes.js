import express from 'express';
import { body } from 'express-validator';
import generateCSR from '../controller/csrController.js';
import { convertPemToPfx, cpUpload } from '../controller/convertController.js';
import { matchKeyToCert } from '../controller/matchController.js';

const router = express.Router();

// SSL backend routes
const csrValidate = [
  body('commonName').trim().notEmpty().withMessage('Common Name cannot be empty'),
  body('countryName')
    .trim()
    .notEmpty()
    .withMessage('Country Name cannot be empty')
    .toUpperCase()
    .isLength({ min: 2, max: 2 })
    .withMessage('Country Name must be two characters'),
  body('stateOrProvinceName').trim().notEmpty().withMessage('State Name cannot be empty'),
  body('localityName').trim().notEmpty().withMessage('Locality Name cannot be empty'),
  body('organizationName').trim().notEmpty().withMessage('Organization Name cannot be empty'),
  body('organizationalUnitName').trim().notEmpty().withMessage('Unit Name cannot be empty'),
  body('emailAddress')
    .trim()
    .notEmpty()
    .withMessage('Email field cannot be empty')
    .isEmail()
    .withMessage('Please type a valid email'),
  body('password').trim().optional()
];

router.route('/csr').post(csrValidate, generateCSR);
router.route('/pem/pfx12').post(cpUpload, convertPemToPfx);

const matchValidate = [
  body('key').trim().notEmpty().withMessage('You must paste the content of a key file'),
  body('certificate').trim().notEmpty().withMessage('You must paste the content of a certificate file')
];
router.route('/match/key/cert').post(matchValidate, matchKeyToCert);

export default router;
