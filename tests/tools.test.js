import request from 'supertest';
import app from '../app.js';

const data = {
  commonName: 'test.com.ng',
  countryName: 'NG',
  stateOrProvinceName: 'FCT',
  localityName: 'Abuja',
  organizationName: 'GBB',
  organizationalUnitName: 'Cloud Ops',
  emailAddress: 'test@gmail.com',
};

test('Should generate a new csr', async () => {
  await request(app).post('/api/v1/csr').send(data).expect(200);
});

test('Should convert certificate to p12', async () => {
  await request(app)
    .post('/api/v1/convertPFX')
    .attach('certificate', 'tests/cert/certificate.pem')
    .attach('key', 'tests/cert/privatekey.key')
    .expect('Content-Type', /octet-stream/)
    .expect(200);
});


