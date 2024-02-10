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
    //Used to handle wildcard domains correctly.
    if (commonName.startsWith('*')) {
      commonName = [commonName];
    } else {
      commonName = [commonName, `www.${commonName}`];
    }
    

    const csroptions = {
      hash: 'sha512',
      subject: {
        //commonName: [commonName, `www.${commonName}`],
        commonName: commonName[0],
        countryName,
        stateOrProvinceName,
        localityName,
        organizationName,
        organizationalUnitName,
        emailAddress
      },
      extensions: {
        basicConstraints: {
          critical: true,
          CA: true,
          pathlen: 1
        },
        keyUsage: {
          // critical: false,
          usages: ['digitalSignature', 'keyEncipherment']
        },
        extendedKeyUsage: {
          critical: true,
          usages: ['serverAuth', 'clientAuth']
        },
        SANs: {
          //DNS: [commonName, `www.${commonName}`],
          DNS: commonName
        }
      }
    };

    if (!password) {
      password = false;
    }

    return new Promise((resolve, reject) => {
      openssl.generateCSR(
        csroptions,
        key,
        password,
        function (err, csr, cmd) {
          // Inject csr into Obj
          this.csrOptions = csroptions;
          if (err) reject(err);
          resolve({ csr, cmd });
        }.bind(this)
      );
    });
  }

  generateSelfSigned(csr, key, password) {
    if (!password) {
      password = false;
    }
    return new Promise((resolve, reject) => {
      // console.log(this);
      this.csrOptions.days = 365;
      // openssl.selfSignCSR(csr, { days: 365 }, key, password, function (err, cert, cmd) {
      openssl.selfSignCSR(csr, this.csrOptions, key, password, function (err, cert, cmd) {
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

  matchRSACert(key, cert) {
    return new Promise((resolve, reject) => {
      openssl.checkRSAMatch(key, false, cert, function (err, result) {
        if (err) reject(err);
        resolve({ result });
      });
    });
  }
}

export default SSLtools;
