import node_openssl from 'node-openssl-cert';

//Initialize openssl library
const openssl = new node_openssl();

class sslTools {
  constructor() {
    this.unencryptkey;
    this.csr;
    this.selfSign;
  }

  // Private method, to be called only within this class.
  _generateUnencryptedPrivatekey() {
    return new Promise((resolve, reject) => {
      openssl.generateRSAPrivateKey(
        {},
        function (err, key, cmd) {
          this.unencryptkey = key;
          if (err) reject(err);
          resolve({ key, cmd });
        }.bind(this)
      );
    });
  }

  // Generate CSR
  async generateCSR(countryName, stateOrProvinceName, localityName, organizationName, organizationalUnitName, commonName, emailAddress) {
    const csroptions = {
      hash: 'sha512',
      subject: {
        countryName,
        stateOrProvinceName,
        localityName,
        organizationName,
        organizationalUnitName,
        commonName,
        emailAddress,
      },
    };
    this.unencryptkey = await this._generateUnencryptedPrivatekey();
    //await this._generateUnencryptedPrivatekey();
    //const key = JSON.stringify(this.key.key);
    //console.log(this.unencyptkey);
    return new Promise(async (resolve, reject) => {
      openssl.generateCSR(
        csroptions,
        this.unencryptkey.key,
        false,
        function (err, csr, cmd) {
          //Inject csr into Obj
          this.csr = csr;
          if (err) reject(err);
          resolve({ cmd, csr, unencryptkey: `${this.unencryptkey.key}` });
        }.bind(this)
      );
    });
  }

  _generateSelfSigned() {}

  convertPCKS() {}
}

export default sslTools;
