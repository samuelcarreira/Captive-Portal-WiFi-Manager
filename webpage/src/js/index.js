/* eslint-disable max-len */

/**
 * Show Hide password on HTML input password type
 * @param {object} elm Element
 */
function showHidePassword(elm) {
  const passwordElm = document.getElementById('text-password');

  if (passwordElm.type === 'password') {
    passwordElm.type = 'text';
    elm.setAttribute('aria-pressed', true);

    elm.title = 'Hide';
    document.getElementById('svg1').style.display = 'none';
    document.getElementById('svg2').style.display = 'inline';
  } else {
    passwordElm.type = 'password';
    elm.setAttribute('aria-pressed', false);

    elm.title = 'Show';
    document.getElementById('svg2').style.display = 'none';
    document.getElementById('svg1').style.display = 'inline';
  }
}

/**
 * Automatic init dialogs
 * Search for buttons with data-dialog_open attribute
 * and add click event listener
 * Also search for close buttons
 */
function initDialogs() {
  const openButtons = document.querySelectorAll('[data-dialog_open]');

  openButtons.forEach((element) => {
    element.addEventListener('click', function() {
      openDialog(this.dataset.dialog_open);
    });
  });

  const closeButtons = document.querySelectorAll('[data-dialog_close]');

  closeButtons.forEach((element) => {
    element.addEventListener('click', function() {
      closeDialog(this.dataset.dialog_close);
    });
  });

  const dialogElements = document.querySelectorAll('[role="dialog"]');

  dialogElements.forEach((element) => {
    element.addEventListener('click', (ev) => {
      if (ev.target.getAttribute('role') === 'dialog') {
        closeDialog(ev.target.id);
      }
    }, false);
  });
}

/**
 * Check for Open dialogs
 * @return {boolean} true if is open
 */
function checkForOpenDialogs() {
  const dialogElements = document.querySelectorAll('[role="dialog"]');

  for (const element of dialogElements) {
    if (element.style.display === 'block') {
      return true;
    }
  }

  return false;
}

/**
 * Toogle IP Settings section visibility
 * @param {string} visibility CSS visibility style
 */
function toggleIPSettings(visibility) {
  document.getElementById('section-ipsettings').style.display = visibility;
}

/**
 * Set Static IP Fields Required Attribute
 * @param {boolean} required state
 */
function setStaticIPFieldsRequired(required) {
  document.getElementById('text-ip').required = required;
  document.getElementById('text-subnet').required = required;
  document.getElementById('text-gateway').required = required;
  // document.getElementById('text-dns1').required = required;
}

/**
 * Close Dialog
 * @param {string} dialogId Element ID
 */
function closeDialog(dialogId) {
  const dialogElement = document.getElementById(dialogId);

  dialogElement.style.display = 'none';
  dialogElement.setAttribute('aria-hidden', true);
}

/**
 * Open Dialog
 * @param {string} dialogId Element ID
 */
function openDialog(dialogId) {
  const dialogElement = document.getElementById(dialogId);

  // no error verification to save some bytes

  if (checkForOpenDialogs()) {
    return;
  }

  dialogElement.style.display = 'block';
  dialogElement.setAttribute('aria-hidden', false);
}

/**
 * Generate SVG symbol
 * @param {number} signal signal strength in dBm
 * @param {number} encryption encryption type (enum wl_enc_type)
 * @return {object} SVG elemment
 */
function generateWifiSVG(signal, encryption) {
  const secure = encryption === 7 ? false : true;
  const newSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  newSVG.setAttribute('width', '24');
  newSVG.setAttribute('height', '24');
  newSVG.setAttribute('viewBox', '0 0 24 24');

  const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  switch (signal) {
    case 4:
      if (secure) {
        newPath.setAttribute('d', 'M12,3C7.79,3 3.7,4.42 0.38,7C4.42,12.06 7.89,16.37 12,21.5C13.23,19.97 14.29,18.66 15.5,17.14V14.5A5,5 0 0,1 20.5,9.5C20.85,9.5 21.2,9.54 21.54,9.62C22.2,8.8 23.03,7.76 23.65,7C20.32,4.41 16.22,3 12,3M20.5,12C19.1,12 18,13.1 18,14.5V16C17.5,16 17,16.5 17,17V21C17,21.5 17.5,22 18,22H23C23.5,22 24,21.5 24,21V17C24,16.5 23.5,16 23,16V14.5C23,13.1 21.9,12 20.5,12M20.5,13C21.3,13 22,13.7 22,14.5V16H19V14.5C19,13.7 19.7,13 20.5,13Z');
      } else {
        newPath.setAttribute('d', 'M12,3C7.79,3 3.7,4.41 0.38,7C4.41,12.06 7.89,16.37 12,21.5C16.08,16.42 20.24,11.24 23.65,7C20.32,4.41 16.22,3 12,3Z');
      }
      break;
    case 3:
      if (secure) {
        newPath.setAttribute('d', 'M12,3C7.79,3 3.7,4.42 0.38,7C4.42,12.06 7.89,16.37 12,21.5C13.23,19.97 14.29,18.66 15.5,17.14V14.5C15.5,12.44 16.77,10.59 18.69,9.84C17.19,8.96 14.84,8 12,8C9,8 6.68,9 5.2,9.84L3.27,7.44C5.91,5.85 8.92,5 12,5C15.07,5 18.08,5.86 20.71,7.45L18.84,9.79C19.37,9.6 19.93,9.5 20.5,9.5C20.85,9.5 21.2,9.54 21.54,9.62C22.2,8.8 23.03,7.76 23.65,7C20.32,4.41 16.22,3 12,3M20.5,12C19.1,12 18,13.1 18,14.5V16C17.5,16 17,16.5 17,17V21C17,21.5 17.5,22 18,22H23C23.5,22 24,21.5 24,21V17C24,16.5 23.5,16 23,16V14.5C23,13.1 21.9,12 20.5,12M20.5,13C21.3,13 22,13.7 22,14.5V16H19V14.5C19,13.7 19.7,13 20.5,13Z');
      } else {
        newPath.setAttribute('d', 'M12,3C7.79,3 3.7,4.41 0.38,7C4.41,12.06 7.89,16.37 12,21.5C16.08,16.42 20.24,11.24 23.65,7C20.32,4.41 16.22,3 12,3M12,5C15.07,5 18.09,5.86 20.71,7.45L18.77,9.88C17.26,9 14.88,8 12,8C9,8 6.68,9 5.21,9.84L3.27,7.44C5.91,5.85 8.93,5 12,5Z');
      }
      break;
    case 2:
      if (secure) {
        newPath.setAttribute('d', 'M12,3C7.79,3 3.7,4.42 0.38,7C4.42,12.06 7.89,16.37 12,21.5C13.23,19.97 14.29,18.66 15.5,17.14V14.5C15.5,13.24 16,12 16.84,11.1C15.62,10.53 14,10 12,10C9.62,10 7.74,10.75 6.5,11.43L3.27,7.44C5.91,5.85 8.92,5 12,5C15.07,5 18.08,5.86 20.71,7.45L18.83,9.79C19.37,9.6 19.93,9.5 20.5,9.5C20.85,9.5 21.2,9.54 21.54,9.62C22.2,8.8 23.03,7.76 23.65,7C20.32,4.41 16.22,3 12,3M20.5,12C19.1,12 18,13.1 18,14.5V16C17.5,16 17,16.5 17,17V21C17,21.5 17.5,22 18,22H23C23.5,22 24,21.5 24,21V17C24,16.5 23.5,16 23,16V14.5C23,13.1 21.9,12 20.5,12M20.5,13C21.3,13 22,13.7 22,14.5V16H19V14.5C19,13.7 19.7,13 20.5,13Z');
      } else {
        newPath.setAttribute('d', 'M12,3C7.79,3 3.7,4.41 0.38,7C4.41,12.06 7.89,16.37 12,21.5C16.08,16.42 20.24,11.24 23.65,7C20.32,4.41 16.22,3 12,3M12,5C15.07,5 18.09,5.86 20.71,7.45L17.5,11.43C16.26,10.74 14.37,10 12,10C9.62,10 7.74,10.75 6.5,11.43L3.27,7.44C5.91,5.85 8.93,5 12,5Z');
      }
      break;
    default:
      if (secure) {
        newPath.setAttribute('d', 'M12,3C16.22,3 20.32,4.41 23.65,7L21.54,9.62L20.5,9.5C19.93,9.5 19.37,9.6 18.83,9.79L20.71,7.45C18.08,5.86 15.07,5 12,5C8.92,5 5.91,5.85 3.27,7.44L8.39,13.8C9.5,13.28 10.75,13 12,13C13.23,13 14.44,13.28 15.55,13.79L15.5,14.5V17.14L12,21.5L0.38,7C3.7,4.42 7.79,3 12,3M23,16C23.5,16 24,16.5 24,17V21C24,21.5 23.5,22 23,22H18C17.5,22 17,21.5 17,21V17C17,16.5 17.5,16 18,16V14.5C18,13.1 19.1,12 20.5,12C21.9,12 23,13.1 23,14.5V16M22,16V14.5C22,13.7 21.3,13 20.5,13C19.7,13 19,13.7 19,14.5V16H22Z');
      } else {
        newPath.setAttribute('d', 'M12,3C7.79,3 3.7,4.41 0.38,7C4.41,12.06 7.89,16.37 12,21.5C16.08,16.42 20.24,11.24 23.65,7C20.32,4.41 16.22,3 12,3M12,5C15.07,5 18.09,5.86 20.71,7.45L15.61,13.81C14.5,13.28 13.25,13 12,13C10.75,13 9.5,13.28 8.39,13.8L3.27,7.44C5.91,5.85 8.93,5 12,5Z');
      }
      break;
  }

  newSVG.appendChild(newPath);

  return newSVG;
}

/**
 * Convert Wifi Strength to a number between 1-4
 * @param {number} signal signal strength in dBm
 * @return {number} 1-4
 */
function convertWifiStrength(signal) {
  if (signal >= -50) {
    return 4; // max
  } else if (signal >= -60) {
    return 3; // good
  } else if (signal >= -67) {
    return 2; // reliable
  } else {
    return 1; // weak
  }
}

/**
 * Encryption Type/Auth mode name
 * @param {number} encryption auth mode code
 * @return {string} auth name
 */
function encryptionType(encryption) {
  switch (encryption) {
    case 5:
      return 'WEP';
    case 2:
      return 'WPA PSK TKIP';
    case 4:
      return 'WPA2 PSK CCMP';
    case 8:
      return 'WPA/WPA2 PSK';
    default:
      // 7
      return 'Open';
  }
}

/**
 * Get SSIDs from server
 */
function getSSIDs() {
  document.getElementById('loading-wifiscan').style.display = 'block';
  document.getElementById('no-networks-found').style.display = 'none';

  // remove event listeners
  document.getElementById('ssid-list').outerHTML = document.getElementById('ssid-list').outerHTML;

  document.getElementById('ssid-list').innerHTML = '';

  fetch('/scannetworks')
      .then((response) => response.json())
      .then((data) => {
        if (!data || !data.length) {
          document.getElementById('no-networks-found').style.display = 'block';
          return;
        }

        // filter invalid signal strengths
        data.forEach((element) => {
          if (isNaN(element.signal) || element.signal > 0) {
            element.signal = -99;
          }
        });

        // sort by signal
        data.sort((a, b) => {
          const signal1 = -1 / parseFloat(a.signal);
          const signal2 = -1 / parseFloat(b.signal);
          return signal2 - signal1;
        });

        // create buttons
        data.forEach((element) => {
          const button = document.createElement('button');
          button.classList.add('ssid-button');
          button.dataset.ssid = element.ssid;

          const span1 = document.createElement('span');
          const newSVG = generateWifiSVG(convertWifiStrength(element.signal), element.encryption);
          span1.title = `${element.signal}dBm | ${encryptionType(element.encryption)}`;
          span1.appendChild(newSVG);

          const span2 = document.createElement('span');
          span2.innerText = element.ssid;

          button.appendChild(span1);
          button.appendChild(span2);

          document.getElementById('ssid-list').appendChild(button);

          button.addEventListener('click', function() {
            fillSSID(this);
          });
        });
      }).then(()=>{
        document.getElementById('loading-wifiscan').style.display = 'none';
      })
      .catch(console.error);
}

/**
 * Get Device info from server
 */
function getInfo() {
  fetch('/getinfo')
      .then((response) => {
        if (response.headers.has('Custom-Restart-Flag')) {
          openDialog('dialog-save');
          document.getElementById('ok-info-message').style.display = 'none';
          document.getElementById('error-info-message').style.display = 'block';
          document.getElementById('error-message-password').style.display = 'block';
          document.getElementById('error-message-saving').style.display = 'none';
        }

        return response.json();
      })
      .then((data) => {
        for (const [key, value] of Object.entries(data)) {
          const element = document.querySelector(`[data-info="${key}"]`);
          if (element) {
            element.innerText = value;
          }
        }
      })
      .catch(console.error);
}

/**
 * Fill SSID on input textbox
 * @param {object} elm button element
 */
function fillSSID(elm) {
  document.getElementById('text-ssid').value = elm.dataset.ssid;
  // document.getElementById('text-password').value = '';

  closeDialog('dialog-wifiscan');
}

/**
 * Only Numbers and dot character
 * @param {object} elm element
 */
function onlyNumberAndADot(elm) {
  elm.value = elm.value.replace(/[^0-9.]/g, '');
}

/**
 * Submit form
 * @param {Event} event
 */
function submitForm(event) {
  event.preventDefault();

  const form = event.target;

  fetch(form.action, {
    method: form.method,
    body: new URLSearchParams([...(new FormData(form))]),
  })
      .then((response) => response.json())
      .then((json) => checkSaveResponse(json))
      .catch((error) => console.log(error));
}

function checkSaveResponse(json) {
  openDialog('dialog-save');

  
  if (json.status) {
    document.getElementById('ok-info-message').style.display = 'block';
    document.getElementById('error-info-message').style.display = 'none';
    document.getElementById('error-message-password').style.display = 'block';
    document.getElementById('error-message-saving').style.display = 'none';
    return;
  }

  document.getElementById('ok-info-message').style.display = 'none';
  document.getElementById('error-info-message').style.display = 'block';
  document.getElementById('error-message-password').style.display = 'none';
  document.getElementById('error-message-saving').style.display = 'block';
}

/**
 * Init event listeners
 */
function initListeners() {
  document.getElementById('btn-showHidePassword').addEventListener('click', function() {
    showHidePassword(this);
  });

  document.getElementById('radio-dhcp').addEventListener('click', () => {
    toggleIPSettings('none');
    setStaticIPFieldsRequired(false);
  });

  document.getElementById('radio-static').addEventListener('click', () => {
    toggleIPSettings('block');
    setStaticIPFieldsRequired(true);
  });

  document.getElementById('button-scanwifi').addEventListener('click', () => {
    openDialog('dialog-wifiscan');
    getSSIDs();
  });

  // needed because I had to use the input type text to use the regex validation
  document.getElementById('text-ip').addEventListener('input', function() {
    onlyNumberAndADot(this);
  });

  document.getElementById('text-subnet').addEventListener('input', function() {
    onlyNumberAndADot(this);
  });

  document.getElementById('text-gateway').addEventListener('input', function() {
    onlyNumberAndADot(this);
  });

  document.getElementById('text-dns1').addEventListener('input', function() {
    onlyNumberAndADot(this);
  });

  document.getElementById('text-dns2').addEventListener('input', function() {
    onlyNumberAndADot(this);
  });

  document.getElementById('form-setup').addEventListener('submit', (event) => {
    submitForm(event);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initListeners();

  initDialogs();

  getInfo();

  // openDialog('dialog-info');
  // openDialog('dialog-firmware');
  // openDialog('dialog-wifiscan');
  // openDialog('dialog-save');
});
