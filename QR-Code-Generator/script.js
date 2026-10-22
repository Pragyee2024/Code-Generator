const inp = document.querySelector('#qrInput');
const genBtn = document.querySelector('#generateBtn');
const qrPopup = document.querySelector('#qrPopup');
const qrImg = document.querySelector('#qrImg');
const downloadBtn = document.querySelector('#downloadBtn');
const closeBtn = document.querySelector('#closeBtn');
const mainContainer = document.querySelector('#mainContainer');

const url = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=';

genBtn.addEventListener('click', () => {
    if(!inp.value) {
        alert('Enter text or URL first!');
    } else {
        const imgUrl = url + inp.value;
        qrImg.setAttribute('src', imgUrl);
        setTimeout(() => {
            qrPopup.classList.add('show');
            mainContainer.classList.add('opacity');
        }, 1000)
    }
});
