import AppError from '../utils/appError.js';
import SSLtools from '../model/sslTools.js';

export const matchKeyToCert = async (req, res, next) => {
  try {
    const { key, certificate } = req.body;

    if (!key || !certificate) {
      return next(new AppError('All fields are mandatory', 400));
    }

    const tools = new SSLtools();
    const resp = await tools.matchRSACert(key.trim(), certificate.trim());

    res.status(200).json({
      status: 'success',
      data: resp,
      message: 'Private key matches the certificate'
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};
