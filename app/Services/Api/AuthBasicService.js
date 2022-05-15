// cat.js

// constructor function for the Cat class
const XMLHttpRequest = require("xhr2");
const {ConfigEnum} = require("../../Enums/ConfigEnum");

class AuthBasicService {
    constructor(){

    }

    basiAuth  = function () {
        var xmlHttp = new XMLHttpRequest();
        var data =JSON.stringify({'grant_type': 'client_credentials'});
        let url = ConfigEnum.base_url + '/oauth/token'


        console.log('UNSENT: ', xmlHttp.status);

        let key = Buffer.from(ConfigEnum.auth.client_id + ':' + ConfigEnum.auth.client_secret ).toString('base64')
        xmlHttp.open( "POST", url , true ); // false for synchronous request
        xmlHttp.setRequestHeader('Content-type', 'application/json');
        xmlHttp.setRequestHeader("Authorization", "Basic " + key);
        xmlHttp.send(data)
        console.log('OPENED: ', xmlHttp.status);

        xmlHttp.onprogress = function () {
            console.log('LOADING: ', xmlHttp.status);
        };

        return xmlHttp;

    }
}


// now we export the class, so other modules can create Cat objects
module.exports = {
    AuthBasicService: new AuthBasicService()
}