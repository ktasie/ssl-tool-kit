import express from 'express';

const router = express.Router();

router
  .get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, 'public/index.html'));
    // res.render('generator', { pretty: true });
    res.render('submitCSR', {
      name: 'index'
    });
  })
  .post('/download-cert', (req, res) => {
    const dataObj = JSON.parse(req.body.dataString);
    // dataObj.commonName = JSON.parse(req.body.commonName);
    // console.log(req.body.dataString);
    res.render('downloadCert', {
      name: 'index',
      dataObj
    });
  });

router.get('/convert', (req, res) => {
  res.status(200).render('pemToPfx', {
    // pretty: true,
    name: 'convert'
  });
});

router.get('/matcher', (req, res) => {
  res.status(200).render('keyMatcher', {
    name: 'matcher'
  });
});

export default router;
