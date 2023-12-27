/* eslint-disable new-cap */
// eslint-disable-next-line camelcase
import node_openssl from 'node-openssl-cert';

// Initialize openssl library
const openssl = new node_openssl();

class SSLtools {
  // No need declaring it as it is not needed
  // constructor() {}

  // Method to generate private key
  generateUnencryptedPrivatekey(password) {
    let rsakeyoptions = {};
    if (password) {
      rsakeyoptions = {
        encryption: {
          password,
          cipher: 'des3'
        },
        rsa_keygen_bits: 2048,
        format: 'PKCS8'
      };
    }
    return new Promise((resolve, reject) => {
      openssl.generateRSAPrivateKey(rsakeyoptions, function (err, key, cmd) {
        // this.unencryptkey = key;
        if (err) reject(err);
        resolve({ key, cmd });
      });
    });
  }

  // Generate CSR
  async generateCSR(
    commonName,
    countryName,
    stateOrProvinceName,
    localityName,
    organizationName,
    organizationalUnitName,
    emailAddress,
    key,
    password
  ) {
    const csroptions = {
      hash: 'sha512',
      subject: {
        commonName,
        countryName,
        stateOrProvinceName,
        localityName,
        organizationName,
        organizationalUnitName,
        emailAddress
      },
      extensions: {
        SANs: {
          DNS: [commonName, `www.${commonName}`]
        }
      }
    };

    if (!password) {
      password = false;
    }

    return new Promise((resolve, reject) => {
      openssl.generateCSR(csroptions, key, password, function (err, csr, cmd) {
        // Inject csr into Obj
        // this.csr = csr;
        if (err) reject(err);
        resolve({ csr, cmd });
      });
    });
  }

  generateSelfSigned(csr, key, password) {
    if (!password) {
      password = false;
    }
    return new Promise((resolve, reject) => {
      // console.log(this);

      openssl.selfSignCSR(csr, { days: 365 }, key, password, function (err, cert, cmd) {
        // this.selfSign = cert;
        if (err) reject(err);
        resolve({ cert, cmd });
      });
    });
  }

  convertPKCS12(cert, unencryptedKey, passwordOut) {
    return new Promise((resolve, reject) => {
      openssl.createPKCS12(
        cert,
        unencryptedKey,
        false,
        passwordOut,
        undefined,
        function (err, pfx, cmd) {
          this.pfx = pfx;
          if (err) reject(err);
          // pfx outputs buffer code...
          this.pfx = pfx;
          resolve({ pfx, cmd });
        }.bind(this)
      );
    });
  }

  matchRSACert(key, cert) {}
}

export default SSLtools;
