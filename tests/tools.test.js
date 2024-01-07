import request from 'supertest';
import app from '../app.js';
import { response } from 'express';

const data = {
  commonName: 'test.com.ng',
  countryName: 'NG',
  stateOrProvinceName: 'FCT',
  localityName: 'Abuja',
  organizationName: 'GBB',
  organizationalUnitName: 'Cloud Ops',
  emailAddress: 'test@gmail.com',
  password: 'test'
};

test('Should generate a new csr', async () => {
  await request(app).post('/api/v1/csr').send(data).expect(200);
});

test('Should convert certificate to p12', async () => {
  await request(app)
    .post('/api/v1/pem/pfx12')
    .attach('certificate', 'tests/cert/example.crt')
    .attach('key', 'tests/cert/privatekey.crt')
    .field('password', '@12testing3')
    .expect(200);
});

test('Should match private key to certificate', async () => {
  await request(app)
    .post('/api/v1/match/key/cert')
    .send({ key: '-----BEGIN PRIVATE KEY----', certificate: '-----BEGIN CERTIFICATE-----' })
    .expect(400);
});
