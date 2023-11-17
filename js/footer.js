async function myFooter() {
    let url = pathJsonAbout;
    var myResponse;

    try {
        myResponse = await fetchData(url);
    } catch (error) {
        console.error('Error in main:', error);
    }

    const jsonData = myResponse;
    let textFooter = `developed by ${myResponse.developer.name}. ${myResponse.license}. version: ${myResponse.version} ${myResponse.data}.`;
    
    let footerElement = document.createElement('footer');
    footerElement.innerHTML = `<p id="textFooter" dir="auto">${textFooter}</p>`;

    let myFooterDiv = document.getElementById('myFooter');
    myFooterDiv.appendChild(footerElement);
}