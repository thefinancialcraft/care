let configData = {}; // Global config data

// Config.json load karo
fetch('config.json')
    .then(response => response.json())
    .then(data => {
        configData = data.apis;
    })
    .catch(error => {
        console.error('Error loading config:', error);
    });

function getSelectedApiUrl() {
    const selectedOption = document.getElementById('myDropdown').value;
    return configData[selectedOption];
}

function fetchLatestOTP() {
    const requestOtpButton = document.getElementById('requestOtpButton');
    const spinnerRequest = document.getElementById('spinnerRequest');
    const otpSectionText = document.querySelector('.otp-sec p');

    spinnerRequest.style.display = 'block';
    if (requestOtpButton && requestOtpButton.firstChild) {
        requestOtpButton.firstChild.textContent = '';
    }

    const msgSection = document.getElementById('msgSection');
    const otpSection = document.getElementById('otpSection');
    if (msgSection) msgSection.style.display = 'none';
    if (otpSection) otpSection.style.display = 'flex';

    otpSectionText.textContent = 'Loading';
    let dots = 0;
    const loadingInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        otpSectionText.textContent = 'Loading' + '.'.repeat(dots);
    }, 500);

    const apiUrl = getSelectedApiUrl();

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            clearInterval(loadingInterval);

            if (requestOtpButton && requestOtpButton.firstChild) {
                requestOtpButton.firstChild.textContent = 'Request OTP';
            }
            spinnerRequest.style.display = 'none';

            displayOtp(data);
        })
        .catch(error => {
            clearInterval(loadingInterval);
            console.error('Error fetching OTP:', error);

            if (requestOtpButton && requestOtpButton.firstChild) {
                requestOtpButton.firstChild.textContent = 'Request OTP';
            }
            spinnerRequest.style.display = 'none';

            otpSectionText.textContent = 'Failed to fetch OTP.';
        });
}

function refreshOtp() {
    const refreshOtpButton = document.getElementById('refreshOtpButton');
    const spinnerRefresh = document.getElementById('spinnerRefresh');
    const otpSectionText = document.querySelector('.otp-sec p');

    spinnerRefresh.style.display = 'block';
    if (refreshOtpButton && refreshOtpButton.firstChild) {
        refreshOtpButton.firstChild.textContent = '';
    }

    otpSectionText.textContent = 'Loading';
    let dots = 0;
    const loadingInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        otpSectionText.textContent = 'Loading' + '.'.repeat(dots);
    }, 500);

    const apiUrl = getSelectedApiUrl();

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            clearInterval(loadingInterval);

            if (refreshOtpButton && refreshOtpButton.firstChild) {
                refreshOtpButton.firstChild.textContent = 'Refresh OTP';
            }
            spinnerRefresh.style.display = 'none';

            displayOtp(data);
        })
        .catch(error => {
            clearInterval(loadingInterval);
            console.error('Error refreshing OTP:', error);

            if (refreshOtpButton && refreshOtpButton.firstChild) {
                refreshOtpButton.firstChild.textContent = 'Refresh OTP';
            }
            spinnerRefresh.style.display = 'none';

            otpSectionText.textContent = 'Failed to fetch OTP.';
        });
}

function displayOtp(data) {
    const otpDigits = document.getElementById('otpDigits');
    const otpSectionText = document.querySelector('.otp-sec p');
    otpDigits.innerHTML = '';

    if (data.otp && data.otp !== 'No OTP found') {
        for (let digit of data.otp) {
            const otpDigitDiv = document.createElement('div');
            otpDigitDiv.classList.add('otp-digit');
            otpDigitDiv.innerText = digit;
            otpDigits.appendChild(otpDigitDiv);
        }

        const dateTimeElement = document.getElementById('date-time');
        if (dateTimeElement) {
            dateTimeElement.innerText = new Date(data.date).toLocaleString();
        }

        otpSectionText.textContent = 'Here is your OTP';

        const requestOtpButton = document.getElementById('requestOtpButton');
        const refreshOtpButton = document.getElementById('refreshOtpButton');

        if (requestOtpButton) requestOtpButton.style.display = 'none';
        if (refreshOtpButton) refreshOtpButton.style.display = 'flex';
    } else {
        otpDigits.innerHTML = '<p>No OTP found</p>';
        const dateTimeElement = document.getElementById('date-time');
        if (dateTimeElement) {
            dateTimeElement.innerText = '';
        }
    }
}
