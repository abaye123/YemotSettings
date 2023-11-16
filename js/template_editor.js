function saveIniFile() {
    var textarea = document.getElementById('extini_editor_textarea');
    var content = textarea.value;

    if (content.trim() !== '' && content.length > 3) {
        var textFileName = document.getElementById('inputFileName').value;
        var filename;
        if (textFileName.length > 0) {
            filename = textFileName + '.ini';
        } else {
            var match = content.match(/type=(\w+)/);
            var fileType = match ? match[1] : 'default';
            filename = fileType + '.ini';
        }

        var blob = new Blob([content], { type: 'text/plain' });
        var link = document.createElement('a');
        link.download = filename;
        link.href = window.URL.createObjectURL(blob);

        link.onload = function () {
            console.log('Download successful!');
            window.URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
        };

        link.onerror = function () {
            console.error('Download failed!');
            showBanner(false, 'התרחשה שגיאה לא ידועה');
            window.URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
        };

        document.body.appendChild(link);
        link.click();
        showBanner(true, 'הקובץ נשמר בהצלחה');
    } else {
        showBanner(false, 'אין הגדרות לשמירה');
    }
}

async function getExtSettingsYemot(button) {
    clickStart(button);
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
    clickStop(button);
}


async function setExtSettingsYemot(button) {
    clickStart(button);
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
    clickStop(button);
}


async function setTextExtsSettingsYemot(button) {
    clickStart(button);
    let numberIvr = document.querySelector('#inputNumber').value;
    let passwordIvr = document.querySelector('#inputPassword').value;
    let textExt = document.querySelector('#extini_editor_textarea').value;
    var paths = document.querySelector('#inputPaths').value;
    if (paths.length > 0) {
        if (numberIvr.length > 3 && passwordIvr.length > 2) {
            let token = await login(numberIvr, passwordIvr);
            if (token !== false) {
                let settings = 'title=הוגדר באמצעות מערכת הגדרות מתקדמות';
                var pathArray = paths.split(', ');
                pathArray.forEach(async function (path) {
                    if (path === '#') {
                        path = '';
                    }
                    console.log(path);
                    let responseExt = await updateExtensionSettings(token, path, settings);
                    if (responseExt == true) {
                        let pathExt = path + '/ext.ini';
                        setTimeout(async function () {
                            responseText = await uploadTextToFile(token, pathExt, textExt);
                            if (path === '') {
                                path = 'ראשית';
                            }
                            if (responseText == true) {
                                showBanner(true, 'ההגדרות נשמרו בהצלחה בשלוחה ' + path);
                            } else {
                                showBanner(false, 'שגיאה בהעלאת ההגדרות לשלוחה ' + path);
                            }
                        }, 300);
                    } else {
                        showBanner(false, 'שגיאה בטעינת שלוחה ' + path);
                    }
                });
            } else {
                showBanner(false, 'שגיאה בהתחברות למערכת. טוקן שגוי');
            }
        } else {
            showBanner(false, 'שגיאה במספר המערכת או הסיסמה');
        }
    } else {
        showBanner(false, 'אין שלוחות להגדרה');
    }
    clickStop(button);
}


async function setUpdateExtsSettingsYemot(button) {
    clickStart(button);
    let numberIvr = document.querySelector('#inputNumber').value;
    let passwordIvr = document.querySelector('#inputPassword').value;
    let textExt = document.querySelector('#extini_editor_textarea').value;
    var paths = document.querySelector('#inputPaths').value;
    if (paths.length > 0) {
        if (numberIvr.length > 3 && passwordIvr.length > 2) {
            let token = await login(numberIvr, passwordIvr);
            if (token !== false) {
                let linesArray = textExt.split('\n');
                var settings = linesArray.join('&');
                if (settings.endsWith('&')) {
                    settings = settings.slice(0, -1);
                  }
                console.log(settings);

                var pathArray = paths.split(', ');
                pathArray.forEach(async function (path) {
                    if (path === '#') {
                        path = '';
                    }

                    console.log(path);
                    setTimeout(async function () {
                        let responseExt = await updateExtensionSettings(token, path, settings);
                        if (path === '') {
                            path = 'ראשית';
                        }
                        if (responseExt == true) {
                            showBanner(true, 'ההגדרות נשמרו בהצלחה בשלוחה ' + path);
                        } else {
                            showBanner(false, 'שגיאה בהעלאת ההגדרות לשלוחה ' + path);
                        }
                    }, 200);
                });
            } else {
                showBanner(false, 'שגיאה בהתחברות למערכת. טוקן שגוי');
            }
        } else {
            showBanner(false, 'שגיאה במספר המערכת או הסיסמה');
        }
    } else {
        showBanner(false, 'אין שלוחות להגדרה');
    }
    clickStop(button);
}