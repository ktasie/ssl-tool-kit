import express from 'express';

const router = express.Router();

router
  .get('/', (req, res) => {
    //res.sendFile(path.join(__dirname, 'public/index.html'));
    //res.render('generator', { pretty: true });
    res.render('generator');
  })
  .post('/downloadcsr', (req, res) => {
    const dataObj = JSON.parse(req.body.dataString);
    //console.log(req.body.dataString);
    res.render('downloadCert', dataObj);
  });

export default router;
