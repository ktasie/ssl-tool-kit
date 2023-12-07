import fs from 'fs';
import Ssltools from '../model/sslTools.js';

export default async (req, res, next) => {
  try {
    //console.log(req.files);
    const cert = req.files.certificate[0].buffer;
    const key = req.files.key[0].buffer;

    // initialize ssl tools object
    const tools = new Ssltools();
    const pfx = await tools.convertPKCS12(cert, key);

    //Sends content-Type as an octet-stream
    res.send(pfx.pfx);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
}