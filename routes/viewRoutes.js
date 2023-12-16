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
    //dataObj.commonName = JSON.parse(req.body.commonName);
    //console.log(req.body.dataString);
    res.render('downloadCert', dataObj);
  });

router.get('/convert', (req, res) => {
  res.status(200).render('sslConverter');
});

export default router;
