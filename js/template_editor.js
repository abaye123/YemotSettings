function saveIniFile() {
    var textarea = document.getElementById('extini_editor_textarea');
    var content = textarea.value;

    // Check if content is not empty and has more than X characters (replace X with your desired value)
    if (content.trim() !== '' && content.length > 3) {
        var match = content.match(/type=(\w+)/);
        var currentDate = new Date();
        var year = currentDate.getFullYear();
        var month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
        var day = ('0' + currentDate.getDate()).slice(-2);
        var hours = ('0' + currentDate.getHours()).slice(-2);
        var minutes = ('0' + currentDate.getMinutes()).slice(-2);
        var seconds = ('0' + currentDate.getSeconds()).slice(-2);
        var formattedDateTime = year + '-' + month + '-' + day + '_' + hours + '-' + minutes + '-' + seconds;
        var fileType = match ? match[1] : 'default_' + formattedDateTime;
        var filename = fileType + '.ini';
        var blob = new Blob([content], { type: 'text/plain' });
        var link = document.createElement('a');

        // Set the download attribute and create the URL
        link.download = filename;
        link.href = window.URL.createObjectURL(blob);

        // Event listener for successful download
        link.onload = function () {
            console.log('Download successful!');
            // Clean up
            window.URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
        };

        // Event listener for failed download
        link.onerror = function () {
            console.error('Download failed!');
            showBanner(false, 'התרחשה שגיאה לא ידועה');
            // Clean up
            window.URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
        };

        // Trigger the download
        document.body.appendChild(link);
        link.click();
        showBanner(true, 'הקובץ נשמר בהצלחה');
    } else {
        showBanner(false, 'אין הגדרות לשמירה');
    }
}


async function getExtSettingsYemot() {
    let numberIvr = document.querySelector('#inputNumber').value;
    let passwordIvr = document.querySelector('#inputPassword').value;
    if (numberIvr.length > 3 && passwordIvr.length > 2) {
        var pathIvr = document.querySelector('#inputPath').value;
        if (pathIvr.length > 0) {
            if (pathIvr === '#') {
                pathIvr = '';
            }
            pathIvr = pathIvr + '/ext.ini';
            let token = await login(numberIvr, passwordIvr);
            if (token !== false) {
                let contents = await getTextFile(token, pathIvr);
                if (contents !== false) {
                    document.querySelector('#extini_editor_textarea').value = contents;
                    showBanner(true, 'ההגדרות יובאו בהצלחה');
                } else {
                    showBanner(false, 'שגיאה בייבוא ההגדרות');
                }
            } else {
                showBanner(false, 'שגיאה בהתחברות למערכת. טוקן שגוי');
            }
        } else {
            showBanner(false, 'לא נבחרה שלוחה');
        }
    } else {
        showBanner(false, 'שגיאה במספר המערכת או הסיסמה');
    }
}


async function setExtSettingsYemot() {
    let numberIvr = document.querySelector('#inputNumber').value;
    let passwordIvr = document.querySelector('#inputPassword').value;
    var pathIvr = document.querySelector('#inputPath').value;
    if (pathIvr.length > 0) {
        if (pathIvr === '#') {
            pathIvr = '';
        }
        if (numberIvr.length > 3 && passwordIvr.length > 2) {
            let token = await login(numberIvr, passwordIvr);
            if (token !== false) {
                let settings = 'title=הוגדר באמצעות מערכת הגדרות מתקדמות'
                let responseExt = await updateExtensionSettings(token, pathIvr, settings);
                if (responseExt == true) {
                    let pathIvrExt = pathIvr + '/ext.ini';
                    let textExt = document.querySelector('#extini_editor_textarea').value;
                    setTimeout(async function () {
                        responseText = await uploadTextToFile(token, pathIvrExt, textExt);
                        if (responseText == true) {
                            showBanner(true, 'ההגדרות נשמרו בהצלחה במערכת');
                        } else {
                            showBanner(false, 'שגיאה בהעלאת ההגדרות');
                        }
                    }, 300);
                } else {
                    showBanner(false, 'שגיאה בטעינת השלוחה המבוקשת');
                }
            } else {
                showBanner(false, 'שגיאה בהתחברות למערכת. טוקן שגוי');
            }
        } else {
            showBanner(false, 'שגיאה במספר המערכת או הסיסמה');
        }
    } else {
        showBanner(false, 'לא נבחרה שלוחה');
    }
}