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


function showStatusIndicator(button ,success) {
    // Assuming you have two image URLs for a checkmark (V) and an X
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
    const banner = document.getElementById('banner');

    if (bool) {
        banner.textContent = message;
        banner.style.color = '#ffffff';
        banner.style.backgroundColor = 'green';
    } else {
        banner.textContent = message;
        banner.style.color = '#ffffff';
        banner.style.backgroundColor = 'red';    
    }

    banner.style.display = 'block';
    banner.classList.add('slide-in-animation');

    setTimeout(() => {
      banner.style.display = 'none';
      banner.classList.remove('slide-in-animation');
    }, 7000);
  }