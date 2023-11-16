function getListSettingsB(element) {
  // Extract the row number from the input element's ID
  const rowNumber = element.id.split('_')[1];
  //const selectElement = document.getElementById('setting_' + rowNumber);
  console.log('Updating select box for row ' + rowNumber);
  console.log("t");
  Promise.all([
    fetchAndParseCsv('ימות'),
    fetchAndParseCsv('תבנית'),
    fetchAndParseCsv('תבנית אישית')
  ])
    .then(dataArray => {
      const mergedData = mergeDataArrays(dataArray);
      populateComboBox(mergedData, rowNumber);
    })
    .catch(error => console.error('Error fetching CSV files:', error));
}


function fetchAndParseCsv(label) {
  let csvPath = pathFiles(label);
  console.log(csvPath);
  return fetch(csvPath)
    .then(response => response.text())
    .then(data => {
      return {
        label: label,
        data: data
      };
    });
}


function mergeDataArrays(dataArray) {
  const mergedData = [];
  dataArray.forEach(item => {
    const lines = item.data.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split(', ');
      if (parts.length === 2) {
        const valueWithBrackets = `${parts[0]} (${item.label})`;
        const valueWithBrackets1 = `${parts[1]} (${item.label})`;
        mergedData.push({
          text: valueWithBrackets,
          value: valueWithBrackets1
        });
      }
    }
  });
  // Sort the merged data by 'text'
  mergedData.sort((a, b) => a.text.localeCompare(b.text));
  return mergedData;
}

function populateComboBox(dataArray, rowNumber) {
  console.log(rowNumber)
  const select = document.getElementById('setting_' + rowNumber);

  // Clear existing options
  while (select.firstChild) {
    select.removeChild(select.firstChild);
  }

  const option = document.createElement('option');
  option.value = 'select';
  option.textContent = 'בחר תבנית מהרשימה..';
  select.appendChild(option);

  // Populate with new options
  dataArray.forEach(item => {
    const option = document.createElement('option');
    option.value = item.value;
    option.textContent = item.text;
    select.appendChild(option);
  });
}



function getSettingExt(element) {
  const rowNumber = element.id.split('_')[1];
  var selectedSetting = document.getElementById("setting_" + rowNumber).value;
  //document.getElementById("settingText").innerHTML = "ההגדרה או הטמפלייט שנבחר הוא " + selectedSetting;

  const divToClear = document.getElementById('div_ext_op_' + rowNumber).innerHTML = '';

  const regex = /\(([^)]+)\)/;
  const match = selectedSetting.match(regex);

  let value, type;

  if (match) {
    value = selectedSetting.replace(regex, '').trim();
    type = match[1].trim();
  } else {
    // If there are no parentheses, set both values to the original string
    value = selectedSetting.trim();
    type = selectedSetting.trim();
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
      console.log(textData);
      processTextFileContent(rowNumber, textData);
      // Now you can work with the text content, e.g., print it in the console
    })
  //.catch(error => {
  //  console.error('Error fetching text file:', error.message);
  //});

}

function processTextFileContent(element, content) {
  // Split the content into an array of lines
  const lines = content.split('\n');
  var x = 1;
  // Iterate through each line

  const currentDiv = document.getElementById('div_ext_op_' + element);
  const newLabel = document.createElement('label');
  const newLabelId = 'ext_op_LabelMain_' + element;
  newLabel.id = newLabelId;
  newLabel.textContent = 'הגדרות משתנות: אין';
  currentDiv.appendChild(newLabel);

  lines.forEach(line => {
    // Use a regular expression to check if the line contains content within curly brackets
    const matches = line.match(/\{([^}]+)\}/g);

    // If matches are found, process each match
    if (matches) {
      matches.forEach(match => {
        // Call another function with the content within brackets
        processContentWithinBrackets(element, line, x);
        x++;
      });
    }
  });
}

function processContentWithinBrackets1(line, content) {
  // Your logic for processing content within brackets goes here
  console.log(line);
  console.log('Content within brackets:', content);
}

function processContentWithinBrackets(element, line, x) {
  // Get the current div
  const currentDiv = document.getElementById('div_ext_op_' + element);
  console.log(element);

  const regex = /([^=]+)=\{([^}]+)\}/;
  const matches = regex.exec(line);

  const textBeforeEqualSign = matches[1].trim();
  const contentInsideBraces = matches[2].trim();

  //line = line.replace(/}/g, '');
  //line = line.replace(/{/g, '');

  const newLabel = document.createElement('label');
  newLabel.id = 'ext_op_Label_' + x;
  newLabel.textContent = textBeforeEqualSign;
  currentDiv.appendChild(newLabel);

  // Create a new input element
  const newInput = document.createElement('input');
  const newInputId = 'ext_op_value_' + x;

  newInput.id = newInputId;
  newInput.type = 'text';
  newInput.className = 'auto-size-input';
  newInput.value = contentInsideBraces; // You can set any default value you want

  currentDiv.appendChild(newInput);
  document.getElementById('ext_op_LabelMain_' + element).textContent = 'הגדרות משתנות: ';
}

function warningPopUp(text) {
  alert(text);
}
