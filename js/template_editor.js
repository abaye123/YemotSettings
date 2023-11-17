function getListTemplate() {
    Promise.all([
        fetchAndParseCsv('ימות'),
        fetchAndParseCsv('תבנית'),
        fetchAndParseCsv('תבנית אישית')
    ])
        .then(dataArray => {
            console.log(dataArray);
            const mergedData = mergeDataArrays(dataArray);
            console.log(dataArray);
            //populateComboBox(mergedData, rowNumber);

            const select = document.getElementById('templateList');

            // Clear existing options
            while (select.firstChild) {
                select.removeChild(select.firstChild);
            }


            const option = document.createElement('option');
            option.value = '';
            option.disabled = false;
            option.textContent = 'בחר תבנית מהרשימה';
            select.appendChild(option);

            // Populate with new options
            mergedData.forEach(item => {
                const option = document.createElement('option');
                option.value = item.value;
                option.textContent = item.text;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching CSV files:', error));
}


function getSettingForTemplate() {
    var selectElement = document.getElementById('templateList');
    var selectedtemplateList = selectElement.value;
    var selectedIndex = selectElement.selectedIndex;
    var selectedOption = selectElement.options[selectedIndex];
    var selectedtemplateListText = selectedOption.text;

    console.log("selectedtemplateList: " + selectedtemplateList);

    const editorTextarea = document.getElementById('extini_editor_textarea')
    editorTextarea.value = '';

    const regex = /\(([^)]+)\)/;
    const match = selectedtemplateList.match(regex);

    let value, type;

    if (match) {
        value = selectedtemplateList.replace(regex, '').trim();
        type = match[1].trim();
    } else {
        // If there are no parentheses, set both values to the original string
        value = selectedtemplateList.trim();
        type = selectedtemplateList.trim();
    }

    let pathJson = pathFolders(type);
    let url = `${pathJson}/${value}.ini`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(textData => {
            console.log('textData: ' + textData);
            textData = textData.replace(/}/g, '');
            textData = textData.replace(/{/g, '');
            editorTextarea.value = textData;
            document.getElementById("title_template").innerHTML = "נטענה התבנית '" + selectedtemplateListText + "'";
            document.getElementById("desc_template").innerHTML = "באפשרותך לערוך את התבנית או להשתמש בה";
        })
        .catch(error => {
            console.error('Error fetching text file:', error.message);
            console.error('Error fetching text file:', selectedtemplateList);
            document.getElementById("title_template").innerHTML = "אירעה שגיאה בעת טעינת התבנית '" + selectedtemplateListText + "'. ייתכן והתבנית אינה קיימת";
            document.getElementById("desc_template").innerHTML = "נסה שנית מאוחר יותר, או דווח לנו על הבעיה";
        });

    select = document.getElementById('templateList')
    if (select.value !== "") {
        select.options[0].disabled = true;
    }
}


async function autocompleteYemot(event) {
    const elementEditor = event.target;
    const content = elementEditor.value;
    console.log('content: ', content)
    if (content.trim().length > 0) {
        const firstLine = content.split('\n')[0];
        const match = firstLine.match(/^type=(.+)/);

        if (match) {
            const valueToSearch = match[1];
            let url = pathJsonallSettings;
            var myResponse;

            try {
                myResponse = await fetchData(url);
            } catch (error) {
                console.error('Error in main:', error);
            }

            const jsonData = myResponse;
            let matchingValues = [];

            if (jsonData.settings[valueToSearch]) {
                const valueObj = jsonData.settings[valueToSearch];
                Object.values(valueObj.keys).forEach(member => {
                    matchingValues.push(member);
                });
            }

            const globalValue = jsonData.settings["global"];
            if (globalValue) {
                Object.values(globalValue.keys).forEach(member => {
                    matchingValues.push(member);
                });
            }

            const textarea = document.getElementById('extini_editor_textarea');
            const cursorPos = textarea.selectionStart;
            const text = textarea.value;

            const startPos = text.lastIndexOf('\n', cursorPos - 1) + 1;
            const endPos = text.indexOf('\n', cursorPos);
            const currentLine = text.substring(startPos, endPos !== -1 ? endPos : undefined);
            const lineNumber = text.substr(0, cursorPos).split('\n').length;
            //console.log('Line Number:', lineNumber);

            const filteredValues = matchingValues.filter(valueObj => {
                return currentLine.trim() !== '' ? valueObj.value.includes(currentLine) : true;
            });

            matchingValues = filteredValues;
            matchingValues.sort((a, b) => (a.value > b.value) ? 1 : -1);

            const autocompleteList = document.getElementById('autocomplete-list');
            if (matchingValues.length > 0) {
                autocompleteList.innerHTML = '';

                matchingValues.forEach(value => {
                    const button = document.createElement('button');
                    button.textContent = value.value + ": " + value.desc;
                    button.addEventListener('click', function () {
                        const cursorPos = document.getElementById('extini_editor_textarea').selectionStart;
                        var contentB = content.substring(0, cursorPos);
                        const lastLineBreak = contentB.lastIndexOf('\n');

                        if (lastLineBreak !== -1) {
                            contentB = content.substring(0, lastLineBreak + 1);
                        }

                        const newText = contentB + value.value + "=" + value.default + '\n' + content.substring(cursorPos);
                        document.getElementById('extini_editor_textarea').value = newText;

                        const textarea = document.getElementById('extini_editor_textarea');
                        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
                        textarea.focus();

                        autocompleteList.style.display = 'none';
                        document.getElementById('extini_editor_textarea').dispatchEvent(new Event('input'));
                    });

                    autocompleteList.appendChild(button);
                });

                var label = document.createElement('label');
                label.textContent = 'לחץ על טאב בכדי לעבור בין הפריטים, ועל Esc כדי לסגור';
                label.dir = "rtl";
                label.style.fontSize = "14px";
                label.style.marginTop = "5px";
                autocompleteList.appendChild(label);

                const cursorPos = elementEditor.getBoundingClientRect();
                autocompleteList.style.display = 'block';
                autocompleteList.style.left = cursorPos.left + 10 + 'px';
                if (cursorPos.top + 28 * lineNumber < cursorPos.top + cursorPos.height - 50) {
                    autocompleteList.style.top = (cursorPos.top + 28 * lineNumber - 80) + 'px';
                } else {
                    autocompleteList.style.top = (cursorPos.top + cursorPos.height - 300) + 'px';
                    autocompleteList.style.left = cursorPos.left - 424 + 'px';
                }

            } else {
                autocompleteList.style.display = 'none';
            }
        } else {
            // כשאין התאמה, לטעון גלובל?
        }
    } else {
        // כשהתיבה ריקה, לטעון רשימת טייפים לשורה ראשונה?
        document.getElementById('autocomplete-list').style.display = 'none';
    }
}

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


function saveAsTemplate() {
    showBanner(false, 'אפשרות זו עדיין לא פעילה');
}