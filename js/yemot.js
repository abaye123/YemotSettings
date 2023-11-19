let logActive = true;
let urlYemotApi = `https://www.call2all.co.il/ym/api/`;

async function login(user, password) {
    let response = await fetch(`${urlYemotApi}Login?username=${user}&password=${password}`);
    var req = await response.text();
    writeLog("response: " + req);
    req = JSON.parse(req);
    writeLog(req.responseStatus);

    if (req.responseStatus == 'OK') {
        writeLog("token: " + req.token);
        return req.token;
    } else {
        return [false, req.message];
    }
}


async function logout(token) {
    let response = await fetch(`${urlYemotApi}Logout?token=${token}`);
    var req = await response.text();
    writeLog("response: " + req);
    req = JSON.parse(req);
    writeLog(req.responseStatus);

    if (req.responseStatus == 'OK') {
        return true;
    } else {
        return false;
    }
}


async function uploadTextToFile(token, path, text) {
    console.log('token:', token);
    console.log('path:', path);
    console.log('text:', text);

    let payload = {
        token: token,
        what: `ivr2:${path}`,
        contents: text
    };

    try {
        let response = await fetch(`${urlYemotApi}UploadTextFile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        let req = await response.json();
        writeLog("response: " + JSON.stringify(req));

        if (req.responseStatus === 'OK') {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error during file upload:", error);
        return false;
    }
}


// עדכון הגדרות שלוחה. מקבל פרמטר טוקן, נתיב והגדרות מופרדות עם & ומחזיר טרו בהצלחה ופולס בשגיאה
async function updateExtensionSettings(token, path, settings) {
    let response = await fetch(`${urlYemotApi}UpdateExtension?token=${token}&path=ivr2:${path}&` + settings);
    var req = await response.text();
    writeLog("response: " + req);
    req = JSON.parse(req);
    writeLog(req.responseStatus);
    if (req.responseStatus == 'OK') {
        return true;
    } else {
        return false;
    }
}


async function getSession(token) {
    let response = await fetch(`${urlYemotApi}GetSession?token=${token}`);
    var req = await response.text();
    writeLog("response: " + req);
    req = JSON.parse(req);
    writeLog(req.responseStatus);
    if (req.responseStatus == 'OK') {
        return req;
    } else {
        return false;
    }
}


async function getTextFile(token, path) {
    let response = await fetch(`${urlYemotApi}GetTextFile?token=${token}&what=ivr2:${path}`);
    var req = await response.text();
    writeLog("response: " + req);
    req = JSON.parse(req);
    writeLog(req.responseStatus);
    if (req.responseStatus == 'OK') {
        return req.contents;
    } else {
        return false;
    }
}

function writeLog(message) {
    // Implement your logging logic here
    // For example, logging to console:
    if (logActive) {
        console.log(message);
    }
}
