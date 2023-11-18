import node_openssl from 'node-openssl-cert';

//Initialize openssl library
const openssl = new node_openssl();

class sslTools {
  //No need declaring it as it is not needed
  //constructor() {}

  // Method to generate private key
  generateUnencryptedPrivatekey() {
    return new Promise((resolve, reject) => {
      openssl.generateRSAPrivateKey(
        {},
        function (err, key, cmd) {
          this.unencryptkey = key;
          if (err) reject(err);
          resolve({ key, cmd });
        }.bind(this),
      );
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
  ) {
    const csroptions = {
      hash: 'sha512',
      days: '600',
      subject: {
        commonName,
        countryName,
        stateOrProvinceName,
        localityName,
        organizationName,
        organizationalUnitName,
        emailAddress,
      },
      extensions: {
        SANs: {
          DNS: [commonName, `www.${commonName}`],
        },
      },
    };
    //confirm if a key was passed.
    if (key !== undefined) {
      this.unencryptkey = key;
    }

    return new Promise((resolve, reject) => {
      openssl.generateCSR(
        csroptions,
        this.unencryptkey,
        false,
        function (err, csr, cmd) {
          //Inject csr into Obj
          this.csr = csr;
          if (err) reject(err);
          resolve({ csr, cmd });
        }.bind(this),
      );
    });
  }

  generateSelfSigned(csr, unencryptkey) {
    if (csr !== undefined) {
      this.csr = csr;
    }

    if (unencryptkey !== undefined) {
      this.unencryptkey = unencryptkey;
    }
    return new Promise((resolve, reject) => {
      //console.log(this);
      openssl.selfSignCSR(
        this.csr,
        { days: 600 },
        this.unencryptkey,
        false,
        function (err, cert, cmd) {
          this.selfSign = cert;
          if (err) reject(err);
          resolve({ cert, cmd });
        }.bind(this),
      );
    });
  }

  convertPKCS12(cert, key) {
    if (cert !== undefined) {
      this.selfSign = cert;
    }
    if (key !== undefined) {
      this.unencryptkey = cert;
    }
    return new Promise((resolve, reject) => {
      //console.log(this.selfSign);
      openssl.createPKCS12(
        this.selfSign,
        this.unencryptkey,
        false,
        false,
        this.selfSign,
        function (err, pfx, cmd) {
          this.pfx = pfx;
          if (err) reject(err);
          // pfx outputs buffer code... needs to be fixed.
          resolve({ pfx, cmd });
        }.bind(this),
      );
    });
  }
}


export default sslTools;
