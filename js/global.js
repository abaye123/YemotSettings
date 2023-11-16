let pathJsonallSettings = `data/allSettingsToExtensionsEditor.json`;

function pathFolders(value) {
    const pathMappings = {
        "ימות": 'data/AllSettingsYemot',
        "תבנית": 'data/templates',
        "תבנית אישית": 'data/user/personalTemplates'
    };

    return pathMappings[value] || null;
}


function pathFiles(value) {
    const pathMappings = {
        "ימות": 'data/listAllSettingsYemot.csv',
        "תבנית": 'data/listAllTemplate.csv',
        "תבנית אישית": 'data/user/listAllTemplateUser.csv'
    };

    return pathMappings[value] || null;
}

function clickStart(button) {
    console.log(button)
    button.style.backgroundColor = 'orange';
    button.style.borderColor = 'orange';
}

function clickStop(button) {
    button.style.backgroundColor = '';
    button.style.borderColor = '';
    /*
    setTimeout(function () {
        button.style.backgroundColor = '';
        button.style.borderColor = '';
    }, 1500);
    */
}

function showStatusIndicator(button, success) {
    const checkmarkUrl = 'https://www.shutterstock.com/image-vector/checkmark-icon-vector-on-white-260nw-1265329480.jpg';
    const xMarkUrl = 'https://uxwing.com/wp-content/themes/uxwing/download/checkmark-cross/cross-icon.svg';

    // Create an image element
    const statusIndicator = document.createElement('img');

    // Set the source based on success or failure
    statusIndicator.src = success ? checkmarkUrl : xMarkUrl;

    // Set alternative text for accessibility
    statusIndicator.alt = success ? 'Success' : 'Failure';

    // Create a wrapper div for the image
    const wrapperDiv = document.createElement('div');
    wrapperDiv.appendChild(statusIndicator);

    // Insert the wrapper div next to the button
    if (button.nextSibling) {
        button.parentNode.insertBefore(wrapperDiv, button.nextSibling);
    } else {
        button.parentNode.appendChild(wrapperDiv);
    }
}

function showBanner(bool, message) {
    const bannersContainer = document.getElementById('banners-container');

    // Get the height of the existing banners
    const existingBannersHeight = Array.from(bannersContainer.children)
        .reduce((totalHeight, banner) => totalHeight + banner.offsetHeight + 10, 0);

    // Create a new banner
    const newBanner = document.createElement('div');
    newBanner.className = 'banner';
    newBanner.textContent = message;
    newBanner.style.color = '#ffffff';
    newBanner.style.backgroundColor = bool ? 'green' : 'red';
    newBanner.classList.add('slide-in-animation');

    // Append the new banner to the container
    bannersContainer.appendChild(newBanner);

    // Position the new banner below the existing banners
    newBanner.style.top = `${150 + existingBannersHeight}px`;
    newBanner.style.left = '-300px';
    newBanner.style.display = 'block';

    setTimeout(() => {
        newBanner.style.display = 'none';
        bannersContainer.removeChild(newBanner);
    }, 7000);

    setTimeout(() => {
        newBanner.style.left = '35px';
    }, 0);
}