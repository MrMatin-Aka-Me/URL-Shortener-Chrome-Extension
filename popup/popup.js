const longUrlInputEl = document.querySelector('.longUrlInput');
const urlFormEl = document.querySelector('.urlForm');
const loaderEl = document.querySelector('.loader');
const responseWrapperEl = document.querySelector('.responseWrapper');
const shortUrlTextEl = document.querySelector('.shortUrlText');
const errorMessageEl = document.querySelector('.errorMessage');
const copyBtnEl = document.querySelector('.copyBtn');
const linkCopiedTextEl = document.querySelector('.linkCopiedText');

urlFormEl.onsubmit = (evt) => {
    evt.preventDefault();
    console.log('submit');
    responseWrapperEl.classList.add('displayNone');
    errorMessageEl.classList.add('displayNone');

    const url = longUrlInputEl.value.trim();
    longUrlInputEl.value = '';

    sendRequest(url);
};

function sendRequest(url) {
    loaderEl.classList.toggle('displayNone');

    let xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.shrtco.de/v2/shorten?url=${url}`)
    xhr.send('');

    xhr.onload = function () {
        console.log('onload');

        if (xhr.status < 200 || xhr.status > 299) {
            errorMessageEl.textContent = `Error ${xhr.status} ${xhr.statusText}`;
            errorMessageEl.classList.remove('displayNone');
        }

        console.log(xhr.response)

        const data = JSON.parse(xhr.response);
        if (data.ok) {
            renderResponseData(data);
        } else {
            errorResponseHandler(data);
        }
    };

    xhr.onloadend = function () {
        loaderEl.classList.toggle('displayNone');
        console.log('onloadend');
    };

    xhr.onerror = function () {
        console.log('onerror');
    }
}

function renderResponseData(data) {
    console.log('renderResponseData');
    responseWrapperEl.classList.remove('displayNone');
    shortUrlTextEl.textContent = data.result?.short_link || data.result?.short_link2 || data.result?.short_link3;
}


function errorResponseHandler(data) {
    console.log('onError');
    responseWrapperEl.classList.add('displayNone');

    let error = 'Unknown error';
    if (data.error_code === 2) {
        error = 'Error: Invalid URL submitted';
    }

    if (data.error_code === 3) {
        error = 'Error: Rate limit reached. Wait a second and try again';
    }

    if (data.error_code === 4) {
        errorMessageEl.innerHTML = `Error: IP-Address has been blocked because of violating terms of service. 
        <a href="https://shrtco.de/disallowed" target="_blank">Click for more infomation</a>`;
        errorMessageEl.classList.remove('displayNone');
        return;
    }

    if (data.error_code === 10) {
        errorMessageEl.innerHTML = `Error: This Link is disallowed. 
        <a href="https://shrtco.de/disallowed" target="_blank">Click for more infomation</a>`;
        errorMessageEl.classList.remove('displayNone');
        return;
    }

    errorMessageEl.textContent = error;
    errorMessageEl.classList.remove('displayNone');
}


copyBtnEl.addEventListener('click', function (evt) {
    linkCopiedTextEl.classList.remove('displayNone');

    navigator.clipboard.writeText(shortUrlTextEl.textContent)
        .then(() => {
            linkCopiedTextEl.textContent = 'Copied!';
            setTimeout(() => {
                linkCopiedTextEl.classList.add('displayNone');
            }, 1500);
            console.log('Copied');
        })
        .catch(err => {
            linkCopiedTextEl.textContent = 'Something went wrong';
            setTimeout(() => {
                linkCopiedTextEl.classList.add('displayNone');
            }, 1500);
            console.log('Something went wrong', err);
        })
});



