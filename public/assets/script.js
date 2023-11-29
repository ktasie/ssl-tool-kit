// Declare all DOM variables
const domStrings = {
  domainName: document.querySelector('#domains'),
  countryName: document.querySelector('#country'),
  stateName: document.querySelector('#state'),
  localityName: document.querySelector('#locality'),
  organizationName: document.querySelector('#organization'),
  unitName: document.querySelector('#unit'),
  email: document.querySelector('#email'),
  submitBtn: document.querySelector('#btn_generate_ssl'),
  progressBar: document.querySelector('#progressbar'),
  dialog: document.querySelector('#dialog'),
  dialogTitle: document.querySelector('.dialog-title'),
  dialogMsg: document.querySelector('.dialog-msg'),
  btnDismiss: document.querySelector('.btn-dismiss'),
};

function redirectPostForm(tag, method, url, enctype, dataString) {
  const form = document.createElement(tag);
  form.method = method;
  form.enctype = enctype;
  form.action = url;
  const hiddenEl = document.createElement('input');
  hiddenEl.type = 'hidden';
  hiddenEl.name = 'dataString';
  hiddenEl.value = dataString;
  form.appendChild(hiddenEl);
  document.body.appendChild(form);
  return form.submit();
}

// Submit the CSR to the backend endpoint
const submitCSR = async () => {
  try {
    //Load spinner
    domStrings.progressBar.classList.remove('d-none');

    //Stringify form inputs
    const raw = JSON.stringify({
      commonName: domStrings.domainName.value,
      countryName: domStrings.countryName.value,
      stateOrProvinceName: domStrings.stateName.value,
      localityName: domStrings.localityName.value,
      organizationName: domStrings.organizationName.value,
      organizationalUnitName: domStrings.unitName.value,
      emailAddress: domStrings.email.value,
    });

    //console.log(raw);

    const reqOptions = {
      method: 'POST',
      headers: { 'content-Type': 'application/json' },
      body: raw,
      redirect: 'follow',
    };

    const resp = await fetch('/api/v1/csr', reqOptions);
    const dataObj = await resp.json();

    const dataString = JSON.stringify(dataObj);

    if (dataObj.status === 'success') {
      //Redirect to download certificate page.
      //console.log(dataString);
      // disable spinner
      //domStrings.progressBar.classList.add('d-none');

      redirectPostForm('form', 'POST', '/downloadcsr', 'application/x-www-form-urlencoded', dataString);
    } else if (dataObj.status === 'Error') {
      //Generate a popup error
      //console.log(dataObj.message);
      throw new Error(`${dataObj.message}`);
    }
  } catch (err) {
    domStrings.progressBar.classList.add('d-none');
    domStrings.dialog.classList.remove('d-none');
    //domStrings.dialogTitle.textContent = `${err.status}`;
    domStrings.dialogTitle.textContent = 'Error';
    domStrings.dialogMsg.textContent = `${err.message}`;

    console.log(err.message);
  }
};

const closeDialog = () => {
  domStrings.dialog.classList.add('d-none');
};

// DOM listener
domStrings.submitBtn.addEventListener('click', submitCSR);
domStrings.btnDismiss.addEventListener('click', closeDialog);
