function getSetting() {
  var selectedSetting = document.getElementById("setting").value;
  document.getElementById("settingText").innerHTML = "ההגדרה או הטמפלייט שנבחר הוא " + selectedSetting;

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

  let pathJson;
  if (type == "ימות") {
    pathJson = 'data/AllSettingsYemot'
  } else if (type == "תבנית") {
    pathJson = 'data/templates'
  } else if (type == "תבנית אישית") {
    pathJson = 'data/user/personalTemplates'
  }

  let url = `${pathJson}/${value}.json`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(jsonData => {
      console.log(jsonData);
      // פונקציה שמנתחת את הגייסון
      createElemnts(jsonData)
      document.getElementById("definitionsText").innerHTML = JSON.stringify(jsonData);
    })
    .catch(error => {
      console.error('Error fetching JSON:', error.message);
    });
}


function createElemnts(data) {
  const jsonData = data;

  // Create a title element with the name
  const titleElement = document.createElement('h1');
  titleElement.textContent = jsonData.name;

  // Create a paragraph element with the description
  const descriptionElement = document.createElement('p');
  descriptionElement.textContent = jsonData.description;

  // Append the title and description to the definitions div
  const definitionsDiv = document.getElementById('definitions');
  definitionsDiv.appendChild(titleElement);
  definitionsDiv.appendChild(descriptionElement);

  // Create an unordered list to display definitions
  const definitionsList = document.createElement('ul');

  // Iterate through definitions and create list items
  for (const key in jsonData.definitions) {
    const definition = jsonData.definitions[key];
    const listItem = document.createElement('li');
    listItem.textContent = `${key}: ${definition.value} - ${definition.description}`;
    definitionsList.appendChild(listItem);
  }

  // Append the definitions list to the definitions div
  definitionsDiv.appendChild(definitionsList);

  // Display the number of members
  const numberOfMembers = Object.keys(jsonData.definitions).length;
  console.log(`Number of members in definitions: ${numberOfMembers}`);

}