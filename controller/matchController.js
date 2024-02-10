import os from 'os';
import { matchedData, validationResult } from 'express-validator';
import AppError from '../utils/appError.js';
import SSLtools from '../model/sslTools.js';

export const matchKeyToCert = async (req, res, next) => {
  try {
    // const { key, certificate } = req.body;
    let errorString = '';
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      for (const el of errors.array()) {
        errorString = `${errorString}${el.msg}${os.EOL}`;
      }
      return next(new AppError(`${errorString}`, 400));
      //return next(errors.array());
    }
    /*
    if (!key || !certificate) {
      return next(new AppError('All fields are mandatory', 400));
    } */

   const { key, certificate } = matchedData(req);
    

    // const { key, certificate } = req.body;
    const tools = new SSLtools();
    const feedback = await tools.matchRSACert(key, certificate);

    if (!feedback.result) {
      return next(new AppError('Private key does not match the certificate', 400));
    }

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
