// domStrings

const domStrings = {
  paragraphEl: document.querySelector('#cmd'),
  form: document.querySelector('#convertForm'),
  certificateInput: document.querySelector('[name = "certificate"]'),
  keyInput: document.querySelector('[name = "key"]'),
  bundleInput: document.querySelector('[name = "bundle"]'),
  password: document.querySelector('[name = "password"]'),
  button: document.querySelector('#btn_generate_ssl'),
  progress: document.querySelector('#progressbar'),
  dialog: document.querySelector('#dialog'),
  dialogTitle: document.querySelector('.dialog-title'),
  dialogMsg: document.querySelector('.dialog-msg'),
  btnDismiss: document.querySelector('.btn-dismiss')
};

// Read all file input elements
const allFileInputList = document.querySelectorAll('.form-upload__input');
// convert to an Array
const allFileInputArr = Array.from(allFileInputList);

const submitForm = async function (event) {
  try {
    event.preventDefault();
    // if (event.target.closest('#btn_generate_ssl')) {
    // Load progress spinner
    domStrings.progress.classList.remove('d-none');

    if (!domStrings.certificateInput.files[0] || !domStrings.keyInput.files[0] || !domStrings.password.value) {
      throw new Error('All fields are mandatory');
    }

    const formdata = new FormData();
    formdata.append('certificate', domStrings.certificateInput.files[0], domStrings.certificateInput.files[0].name);
    formdata.append('key', domStrings.keyInput.files[0], domStrings.keyInput.files[0].name);
    formdata.append('password', domStrings.password.value);

    const requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };

    const response = await fetch('/api/v1/pem/pfx12', requestOptions);
    const result = await response.json();

    if (result.status === 'success') {
      // Hide loading spinner
      domStrings.progress.classList.add('d-none');

      // Used to name the zip file content
      const pfxName = domStrings.certificateInput.files[0].name.split('.')[0];

      // Reset all form inputs
      this.reset();
      document.querySelector('#certificate').textContent = 'No file chosen';
      document.querySelector('#key').textContent = 'No file chosen';
      // domStrings.password.value = result.pfx.data
      // const html = '<i class="fa-solid fa-gears fa-beat"></i>Download PFX';
      // domStrings.button.insertAdjacentHTML('afterbegin', html)

      // Rename and convert convert btn
      // domStrings.button.innerHTML = html;
      domStrings.paragraphEl.textContent = result.data.cmd.command[0]
      const zip = new JSZip();

      zip.file(`${pfxName}.pfx`, result.data.pfx.data);

      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, `${pfxName}.zip`);
      });
    } else if (result.status === 'fail') {
      throw new Error(`${result.message}`);
    }
    // }
  } catch (err) {
    domStrings.progress.classList.add('d-none');
    domStrings.dialog.classList.remove('d-none');
    domStrings.dialogTitle.textContent = 'Fail';
    domStrings.dialogMsg.textContent = err.message;
    //console.log(err);
  }
};

const closeDialog = () => {
  domStrings.dialog.classList.add('d-none');
};

// domStrings.button.addEventListener('click', submitForm);
domStrings.form.addEventListener('submit', submitForm);
domStrings.btnDismiss.addEventListener('click', closeDialog);

allFileInputArr.forEach((fileInput) => {
  fileInput.addEventListener('change', function () {
    const nameAttrib = this.getAttribute('name');

    document.querySelector(`#${nameAttrib}`).textContent = this.files[0].name;
  });
});
