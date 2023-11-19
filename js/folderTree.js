async function createFolderArray() {
    try {
        var jsonData = await fetchData(`https://www.call2all.co.il/ym/api/GetIVR2Dir?token=${tokenGlobal}&path=ivr2:/`);
        return jsonData;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function createFolderTree(folderArray, parentElement) {
    var folderList = document.createElement('ul');

    if (folderArray.dirs) {
        folderArray.dirs.forEach(folder => {
            var folderItem = document.createElement('li');
            folderItem.textContent = folder.name;

            if (folder.fileType === 'EXT' || folder.fileType === 'DIR') {
                folderItem.classList.add('folder');
                folderItem.addEventListener('click', function () {
                    handleFolderClick(folder, folderItem, folderArray);
                });

                if (folder.dirs && folder.dirs.length > 0) {
                    var subfolderList = createFolderTree({ dirs: folder.dirs, ini: [] }, folderItem);
                    folderItem.appendChild(subfolderList);
                }
            }

            folderList.appendChild(folderItem);
        });
    }

    if (folderArray.ini) {
        console.log(folderArray.ini)

        let select = document.getElementById('selectFilesList')

        // Clear existing options
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }

        folderArray.ini.forEach(iniFile => {
            var iniItem = document.createElement('li');
            iniItem.textContent = iniFile.name;
            iniItem.classList.add('ini-file');
            iniItem.addEventListener('click', function () {
                handleIniFileClick(iniFile);
            });

            folderList.appendChild(iniItem);

            // Update selectFilesList dropdown
            var option = document.createElement('option');
            option.value = iniFile.what; // Set the value to 'what' property
            option.text = iniFile.name; // Display the 'name' property

            select.appendChild(option);
        });
        importIniContent();
    }

    return folderList;
}

async function handleFolderClick(folder, folderItem, parentArray) {
    console.log("Clicked Folder Data:", folder);

    if (!folder.subfoldersFetched) {
        await fetchSubfolders(folder.what, folderItem, parentArray);
        folder.subfoldersFetched = true;
    } else {
       // var ulElements = folderItem.querySelectorAll('ul');
        // Remove each ul element
      //  ulElements.forEach(function (ulElement) {
      //      ulElement.remove();
     //   });

       // folder.subfoldersFetched = false;
    }
}

async function handleIniFileClick(iniFile) {
    console.log("Clicked INI File Data:", iniFile);

    //let numberIvr = document.querySelector('#inputNumber').value;
    //let passwordIvr = document.querySelector('#inputPassword').value;
    //if (numberIvr.length > 3 && passwordIvr.length > 2) {
    var pathIvr = iniFile.what.split(":")[1];
    console.log('pathIvr: ', pathIvr);
    if (pathIvr.length > 0) {
        /*
        if (pathIvr === '#') {
            pathIvr = '';
        }
        pathIvr = pathIvr + '/ext.ini';
        */
        //let token = await login(numberIvr, passwordIvr);
        //if (token !== false) {
        let contents = await getTextFile(tokenGlobal, pathIvr);
        if (contents !== false) {
            document.querySelector('#extini_editor_textarea').value = contents;
            //let numberExt = pathIvr.split("/")[0];
            let segments = pathIvr.split('/');
            let fileName = segments.pop();
            let pathLastSlash = segments.join('/');
            console.log('numberExt: ', fileName)
            console.log('pathLastSlash: ', pathLastSlash)
            if (pathLastSlash === '') {
                pathLastSlash = '#';
            }
            if (fileName !== 'ext.ini') {
                pathLastSlash = pathLastSlash + '/' + fileName;
            }
            document.querySelector('#inputPath').value = pathLastSlash;
            document.querySelector('#inputPath').value = pathLastSlash;

            let selectElement = document.querySelector('#selectFilesList');
            let optionToEdit = selectElement.options[0];
            optionToEdit.textContent = fileName;
            optionToEdit.value = iniFile.what;
            showBanner(true, 'ההגדרות יובאו בהצלחה');
        } else {
            showBanner(false, 'שגיאה בייבוא ההגדרות');
        }
        //} else {
        //   showBanner(false, 'שגיאה בהתחברות למערכת. טוקן שגוי');
        //}
    } else {
        showBanner(false, 'לא נבחרה שלוחה');
    }
    //} else {
    //    showBanner(false, 'שגיאה במספר המערכת או הסיסמה');
    //}
}

async function fetchSubfolders(folderPath, parentFolderItem, parentArray) {
    try {
        //let numberIvr = document.querySelector('#inputNumber').value;
        //let passwordIvr = document.querySelector('#inputPassword').value;
        var subfolderData = await fetchData(`https://www.call2all.co.il/ym/api/GetIVR2Dir?token=${tokenGlobal}&path=${folderPath}`);
        console.log("Subfolder Data:", subfolderData);

        if (subfolderData && (subfolderData.dirs || subfolderData.ini)) {
            var newSubfolders = {
                dirs: subfolderData.dirs || [],
                ini: subfolderData.ini || []
            };

            if (parentArray) {
                parentArray.dirs = parentArray.dirs.filter(subfolder => subfolder.what !== folderPath);
                parentArray.dirs.push({ dirs: newSubfolders.dirs, ini: [] });
            }

            if (newSubfolders.dirs.length > 0 || newSubfolders.ini.length > 0) {
                var subfolderList = createFolderTree(newSubfolders, parentFolderItem);
                parentFolderItem.appendChild(subfolderList);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}