import express from 'express';
import multer from 'multer';
import csrGenerator from '../controller/csrController.js';
import convertCert from '../controller/convertController.js';

const router = express.Router();
const upload = multer();
const cpUpload = upload.fields([
  { name: 'certificate', maxCount: 1 },
  { name: 'key', maxCount: 1 },
]);

//zupload.

router.route('/csr').post(csrGenerator);

router.post('/convertPFX', cpUpload, convertCert);

/*
router.route('/certMatch').post((req, res, next) => {
  res.send('hello world');
});,
*/

export default router;
