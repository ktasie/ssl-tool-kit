import express from 'express';
import generateCSR from '../controller/csrController.js';
import { convertPemToPfx, cpUpload } from '../controller/convertController.js';
import { matchKeyToCert } from '../controller/matchController.js';

const router = express.Router();

// SSL backend routes
router.route('/csr').post(generateCSR);
router.route('/pem/pfx12').post(cpUpload, convertPemToPfx);
router.route('/match/key/cert').post(matchKeyToCert);

export default router;
