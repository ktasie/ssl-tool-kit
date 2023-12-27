import multer from 'multer';
import SSLtools from '../model/sslTools.js';
import AppError from '../utils/appError.js';

const multerStorage = multer.memoryStorage();

const limits = {
  fileSize: 2000000
};

const multerFilter = (req, file, cb) => {
  if (file.mimetype === 'application/x-x509-ca-cert') {
    cb(null, true);
  } else {
    cb(new AppError('Only x509 certificates are accepted. Ensure your files are .crt extensions', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  limits,
  fileFilter: multerFilter
});

// Upload to Memory
export const cpUpload = upload.fields([
  { name: 'certificate', maxCount: 1 },
  { name: 'key', maxCount: 1 }
]);

export async function convertPemToPfx(req, res, next) {
  try {
    if (!req.files.certificate || !req.files.key || !req.body.password) {
      return next(new AppError('All fields are compulsory', 400));
    }

    // read all input values
    const pem = req.files.certificate[0].buffer;
    const key = req.files.key[0].buffer;
    const { password } = req.body;

    // initialize ssl tools object
    const tools = new SSLtools();

    const pfx = await tools.convertPKCS12(pem, key, password);

    // Sends content-Type as an octet-stream
    // res.send(pfx.pfx);

    res.status(200).json({
      status: 'success',
      data: pfx
    });
  } catch (err) {
    // console.log(err);
    return next(new AppError(err, 400));
    /*
    res.status(400).json({
      status: 'fail',
      message: err
    });
    */
  }
}
