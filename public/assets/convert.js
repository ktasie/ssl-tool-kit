// Read all file input elements
const allFileList = document.querySelectorAll('.form-upload__input');
//convert to an Array
const allFileArr = Array.from(allFileList);

allFileArr.forEach((el) => {
  el.addEventListener('change', function (event) {
    const el = event.target.dataset.attach;
    document.querySelector(`div[data-attach='${el}']`).textContent = event.target.files[0].name;
  });
});
