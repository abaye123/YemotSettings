function showExtDivCount() {
    const extsDiv = document.getElementById('exts');
    if (extsDiv) {
        const extDivs = extsDiv.querySelectorAll('div[id^="ext_"]');
        const count = extDivs.length;
        alert('Number of divs with IDs starting with "ext_": ' + count);
    } else {
        console.error('exts div not found.');
    }
}

/*
function getDivs() {
    const extsDiv = document.getElementById('exts');

    if (extsDiv) {
        // Select all divs with IDs starting with "ext_"
        const extDivs = extsDiv.querySelectorAll('div[id^="ext_"]');

        // Iterate through each div
        extDivs.forEach(extDiv => {
            const extNumber = extDiv.id.split('_')[1]; // Extract the number from the div ID
            getDataFromDiv(extNumber)
        }
        )
    }
}

function getDataFromDiv(divNumber) {
    const extDiv = document.getElementById('ext_' + divNumber);

    if (extDiv) {
        const inputData = {
            input: extDiv.querySelector('#input_' + divNumber).value,
            setting: extDiv.querySelector('#setting_' + divNumber).value,
            extOpData: {}
        };

        const divExtOp = extDiv.querySelector('#div_ext_op_' + divNumber);
        const extOpLabelMain = divExtOp.querySelector('#ext_op_LabelMain_' + divNumber).textContent.trim();

        if (extOpLabelMain !== 'Variable settings: none') {
            // Iterate through elements with IDs like ext_op_Label_(running number) and ext_op_(running number)
            const extOpElements = divExtOp.querySelectorAll('[id^="ext_op_Label_"], [id^="ext_op_"]');
            extOpElements.forEach(element => {
                const elementId = element.id;
                const elementValue = element.tagName === 'INPUT' ? element.value : element.textContent.trim();
                inputData.extOpData[elementId] = elementValue;
            });
        }

        console.log('Data from ext_' + divNumber + ':', inputData);

        // Convert the data to JSON format
        const jsonData = JSON.stringify(inputData, null, 2);
        console.log('JSON Data:', jsonData);

        // You can download the JSON data to a file (optional)
        const blob = new Blob([jsonData], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'data_from_ext_' + divNumber + '.json';
        a.click();
    } else {
        console.error('ext_' + divNumber + ' not found.');
    }
}
*/

function getDataFromDivs(bth) {
    const extsDiv = document.getElementById('exts');
    var allData;
    var inputData0 = [];

    inputData0 = {
        numberIvr: document.querySelector('#numberIvr').value,
        passwordIvr: document.querySelector('#passwordIvr').value,
        extMain: document.querySelector('#extMain').value,
        exts: []
    };

    if (extsDiv) {
        // Select all divs with IDs starting with "ext_"
        const extDivs = extsDiv.querySelectorAll('div[id^="ext_"]');

        // Iterate through each div
        extDivs.forEach(extDiv => {
            const extNumber = extDiv.id.split('_')[1]; // Extract the number from the div ID

            var selectedSetting = extDiv.querySelector('#setting_' + extNumber).value
            const regex = /\(([^)]+)\)/;
            const match = selectedSetting.match(regex);
            let value, type;
            if (match) {
                value = selectedSetting.replace(regex, '').trim();
                type = match[1].trim();
            } else {
                value = selectedSetting.trim();
                type = selectedSetting.trim();
            }

            const divExtOp = extDiv.querySelector('#div_ext_op_' + extNumber);
            const extOpLabelMain = divExtOp.querySelector('#ext_op_LabelMain_' + extNumber).textContent.trim();
            var extOpLabelMainBool;
            if (extOpLabelMain !== "הגדרות משתנות: אין") {
                extOpLabelMainBool = true;
            } else {
                extOpLabelMainBool = false;
            }

            // Extract values from elements
            const inputData = {
                divExtName: extDiv.id,  // Add the extDiv name
                extPath: extDiv.querySelector('#input_' + extNumber).value,
                templateName: value,
                templateType: type,
                settingsChanged: extOpLabelMainBool,
                settingsChangedValue: []
            };

            if (extOpLabelMain !== "הגדרות משתנות: אין") {
                // Select all elements with IDs starting with "ext_op_Label_" and "ext_op_value_"
                const extOpLabels = divExtOp.querySelectorAll('[id^="ext_op_Label_"]');
                extOpLabels.forEach(extOpLabel => {
                    const extOpNumber = extOpLabel.id.split('_')[3]; // Extract the number from the ext_op_Label element ID
                    const extOpLabelText = extOpLabel.textContent.trim();
                    const extOpValue = divExtOp.querySelector('#ext_op_value_' + extOpNumber).value.trim();

                    // Add ext_op data to array
                    inputData.settingsChangedValue.push({
                        label: extOpLabelText,
                        value: extOpValue
                    });
                });
            }

            inputData0.exts.push(inputData)
        });
        allData = (inputData0);
        //console.log(allData);
        if (bth === 'bth_saveExt') {
            downloadJSON(allData);
        } else if (bth === 'bth_updateExt') {
            processingJson(allData)
        }
    } else {
        console.error('exts div not found.');
    }
}

function downloadJSON(data) {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'all_ext.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function processingJson(extData) {
    // Accessing values
    let numberIvr = extData.numberIvr;
    let passwordIvr = extData.passwordIvr;
    let extMain = extData.extMain;

    let token = await login(numberIvr, passwordIvr);
    console.log("token:", token);

    if (token != false) {

        // Looping through exts
        extData.exts.forEach(ext => {
            console.log("divExtName:", ext.divExtName);
            let extPath = ext.extPath;
            let templateName = ext.templateName;
            let templateType = ext.templateType;
            //let extPath = ext.extPath;
            console.log("templateName:", ext.templateName);
            console.log("templateType:", ext.templateType);
            console.log("settingsChanged:", ext.settingsChanged);

            let labelsArray = [];
            let valuesArray = [];

            // If settingsChanged is true, loop through settingsChangedValue
            if (ext.settingsChanged) {
                console.log("settingsChangedValue:");
                ext.settingsChangedValue.forEach(setting => {
                    //console.log("  label:", setting.label);
                    //console.log("  value:", setting.value);

                    // Add label to the array
                    labelsArray.push(setting.label);
                    valuesArray.push(setting.value);
                });
            }

            // Output the labels array
            console.log("Labels Array:", labelsArray);
            console.log("values Array:", valuesArray);

            var path;
            if (extMain != null) {
                path = `${extMain}/${extPath}`;
            } else {
                path = `${extPath}`;
            }

            var textExt = getTextExtFile(templateName, templateType);

            // Example usage
            getTextExtFile(templateName, templateType)
                .then(textExt => {
                    if (textExt !== null) {
                        let lines = textExt.split('\n');
                        let resultArray = [];

                        // Iterate through each line
                        for (let line of lines) {
                            // Find the label at the beginning of the line (up to the = sign)
                            let match = line.match(/^[^=]+/);

                            if (match) {
                                let label = match[0].trim();
                                let labelIndex = labelsArray.indexOf(label);

                                if (labelIndex !== -1) {
                                    // If a match is found, add the corresponding value from valuesArray
                                    let value = valuesArray[labelIndex];
                                    resultArray.push(`${label}=${value}`);
                                    console.log(`${label}=${value}`);
                                } else {
                                    // If no match is found, add the content of the line as is
                                    resultArray.push(line);
                                }
                            } else {
                                // If the line doesn't start with a label, add it as is
                                resultArray.push(line);
                            }
                        }

                        let textExtAll = resultArray.join('\n');
                        console.log(textExtAll)
                        
                        callToYemot(token, path, textExtAll);
                    } else {
                        console.log('Error fetching text data');
                    }
                });


        });
        logout(token);
    } else {
        warningPopUp("התרחשה שגיאה בעת יצירת טוקן ההתחברות לימות המשיח, נסו שנית. ייתכן ומספר המערכת או הסיסמה שגויים.")
    }
}


async function getTextExtFile(templateName, templateType) {
    let pathFile;
    if (templateType == "ימות") {
        pathFile = 'data/AllSettingsYemot';
    } else if (templateType == "תבנית") {
        pathFile = 'data/templates';
    } else if (templateType == "תבנית אישית") {
        pathFile = 'data/user/personalTemplates';
    }

    let url = `${pathFile}/${templateName}.ini`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const textExt = await response.text();
        console.log('textData: ' + textExt);

        return textExt;
    } catch (error) {
        console.error('Error fetching text data:', error);
        return null; // or handle the error in a way that fits your use case
    }
}


async function callToYemot(token, path, text) {
    let settings = `title=אימות יצירה`;
    let sendSettings = updateExtensionSettings(token, path, settings);
    console.log('sendSettings:', sendSettings);

    setTimeout(async function () {
        console.log('After 1 seconds');
        let pataAll = `${path}/ext.ini`
        let sendText = await uploadTextToFile(token, pataAll, text);
        console.log('sendText:', sendText);
    }, 1000);
}