import { matchedData, validationResult } from 'express-validator';
import AppError from '../utils/appError.js';
import SSLtools from '../model/sslTools.js';

export const matchKeyToCert = async (req, res, next) => {
  try {
    // const { key, certificate } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError('All fields are mandatory', 400));
      // return next(errors.array());
    }
    /*
    if (!key || !certificate) {
      return next(new AppError('All fields are mandatory', 400));
    } */
    const { key, certificate } = matchedData(req);

    // const { key, certificate } = req.body;
    const tools = new SSLtools();
    const feedback = await tools.matchRSACert(key.trim(), certificate.trim());

    res.status(200).json({
      status: 'success',
      data: feedback,
      message: 'Private key matches the certificate'
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};
