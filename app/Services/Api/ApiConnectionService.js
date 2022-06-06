// cat.js

// constructor function for the Cat class
const XMLHttpRequest = require("xhr2");
const {ConfigEnum} = require("../../Enums/ConfigEnum");
const Axios = require('axios');

const path = require("path");
const fs = require('fs')
const FormData = require('form-data');


class ApiConnectionService {
    constructor(){
        this.token = 'asem'
    }

    restApi(url,type, payload, query) {
        this.response = null
        url = ConfigEnum.base_url + url
        var xmlHttp = new XMLHttpRequest();
        var payload =JSON.stringify(payload);
        url = ConfigEnum.auth.base_url + url
        let access_token = ConfigEnumConfigEnum.access_token

        console.log('UNSENT: ', xmlHttp.status);
        xmlHttp.open( type, url, true ); // false for synchronous request
        xmlHttp.setRequestHeader('Accept', 'application/json');
        xmlHttp.setRequestHeader('Content-Type', 'multipart/form-data');
        xmlHttp.setRequestHeader("Authorization", "Basic " + key);
        xmlHttp.send(payload)
        console.log('OPENED: ', xmlHttp.status);

        xmlHttp.onprogress = function () {
            console.log('LOADING: ', xmlHttp.status);
        };
        return xmlHttp;
    }

     axios (url,type, payload, query) {
        url = ConfigEnum.base_url + url
        if (type.toLowerCase() === 'post'){
            let form = new FormData();
            console.log('form : ' , payload)
            for (var k in payload) {
                if (payload.hasOwnProperty(k)) {
                    if (k === 'picture_vehicle_in' ){
                        payload[k] = path.join(__dirname,'../../..'+ payload[k])
                        form.append(k, fs.createReadStream(payload[k]));
                    } else {
                        form.append(k, payload[k]);
                    }



                }
            }
            // const file =  fs.readFile(pathName);
            console.log('b')
            // form.append('file', file, 'my-image.jpg')

            let key = this.getToken()
            console.log('token : ' , key)
            return Axios.post(url, form, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization' : "Bearer " + key,
                    'Content-Type': `multipart/form-data`,
                }
            })
        } else {
            return Axios.get(url, {
                headers: {
                    'Accept': 'application/json',
                }
            })
        }
    }

    getToken (){
        return this.token
    }

    setToken(access_token){
        this.token = access_token
    }

}


// now we export the class, so other modules can create Cat objects
module.exports = {
    ApiConnectionService: new ApiConnectionService()
}