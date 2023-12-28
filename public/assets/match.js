// Declare usable DOM variables
const domStrings = {
  key: document.querySelector('#key'),
  certificate: document.querySelector('#certificate'),
  matchBtn: document.querySelector('#match'),
  paragraph: document.querySelector('p'),
  progressBar: document.querySelector('#progressbar'),
  dialog: document.querySelector('#dialog'),
  dialogTitle: document.querySelector('.dialog-title'),
  dialogMsg: document.querySelector('.dialog-msg'),
  btnDismiss: document.querySelector('.btn-dismiss')
};

const compareKeys = async () => {
  try {
    // Load spinner
    domStrings.progressBar.classList.remove('d-none');

    // const keyTrim =
    // const certTrim =

    const raw = JSON.stringify({
      key: domStrings.key.value,
      certificate: domStrings.certificate.value
    });

    const requestOptions = {
      method: 'POST',
      headers: { 'content-Type': 'application/json' },
      body: raw,
      redirect: 'follow'
    };

    const response = await fetch('/api/v1/match/key/cert', requestOptions);
    const matchStatus = await response.json();

    // console.log(matchStatus);
    if (matchStatus.status === 'success') {
      domStrings.progressBar.classList.add('d-none');
      domStrings.paragraph.textContent = `${matchStatus.message}`;
      domStrings.paragraph.style.color = '#4caf50';
    } else if (matchStatus.status === 'fail') {
      throw new Error(`${matchStatus.message}`);
    }
  } catch (err) {
    domStrings.progressBar.classList.add('d-none');
    domStrings.dialog.classList.remove('d-none');
    domStrings.dialogTitle.textContent = 'Fail';
    domStrings.dialogMsg.textContent = err.message;
  }
};

const closeDialog = () => {
  domStrings.dialog.classList.add('d-none');
};

domStrings.matchBtn.addEventListener('click', compareKeys);
domStrings.btnDismiss.addEventListener('click', closeDialog);
