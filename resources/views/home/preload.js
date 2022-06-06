// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const {contextBridge, ipcRenderer} = require("electron");
const serialport = require('serialport')
const tableify = require('tableify')
const ByteLength = require('@serialport/parser-byte-length')
const Readline = require('@serialport/parser-readline')
const StorageService = require("../../../app/Services/Storage/StorageService");
const path = require("path");

var pathToFfmpeg = require('ffmpeg-static');

const shell = require('any-shell-escape')
const {exec} = require('child_process')
let Store = null
console.log(pathToFfmpeg);

const port = new serialport('COM4',
    {
        echo: true,
        record: true,
        baudRate: 9600,
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        rtscts: false
    })

const makeMp3 = shell([
    pathToFfmpeg,
    // '-ss', '1',
    // 'error',

    '-i', 'rtsp://admin:admin@192.168.110.51:554',
    // '-q:v', '4',
    '-frames:v', '1', '-q:v', '2',
    '-strftime', '1',
    path.join('Z:', '%Y-%m-%d_%H-%M-%S.jpg'),
])



// Switches the port into "flowing mode"
port.on('data', function (data) {
    console.log('Data port  data:', data)
    console.log('Data port  data:', data.toString())
    let a = async (someArgument) => {
        return await ipcRenderer.invoke('some-name', someArgument).then((result) => {
            return result
        })
    }

    if (data.toString() == '*IN1ON#') {
        port.write('TRIG1#');
        a()
        exec(makeMp3, (err) => {
            if (err) {
                console.error(err)
                process.exit(1)
            } else {
                console.info('done!')
            }
        })
    }

})


contextBridge.exposeInMainWorld(
    "api", {
        doAction: async (someArgument) => {
            return await ipcRenderer.invoke('some-name', someArgument).then((result) => {
                return result
            })
        },
        ticketGet: async (someArgument) => {
            return await ipcRenderer.invoke('ticket-get', someArgument).then((result) => {
                return result
            })
        },
        send1: (channel, data) => {
            // whitelist channels
            let validChannels = ["toMain"];
            if (validChannels.includes(channel)) {
                console.log('ok-yyyy')
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            console.log('ok')
            let validChannels = ["fromMain"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`
                ipcRenderer.on('fromMain', function () {
                    return 'apalah'
                })
                // ipcRenderer.on(channel, (event, args) => func(...args));
            }
        }
    }
);


ipcRenderer.invoke('read-user-data').then(
    (result) => {
        Store = new StorageService({
            // We'll call our data file 'user-preferences'
            'configName': 'parkir-client',
            'dataPath': result
        })

        async function ticketGet (someArgument) {
            return await ipcRenderer.invoke('ticket-get', someArgument).then((result) => {
                return result
            })
        }

        function getTicket() {

            (async () => {
                const response = await ticketGet({barcode_no: '20220527154316PK'})
                console.log('-----dari getTicket-------')
                console.log(response)
                console.log('--------------------')
            })();
        }

        console.log('go to aa ', Store.get('user'))
        console.log('go to bb ', Store.get('access_token'))
        console.log('go to bb ', Store.get('vehicles'))

        window.addEventListener('DOMContentLoaded', () => {
            const $ = require('jquery');
            (function($) {
                let user = Store.get('user')
                let vehicles = Store.get('vehicles')
                const replaceText = (selector, text) => {
                    for (const key in user) {
                        const element = document.getElementById(selector)
                        if (element) element.innerText = text
                    }
                }

                console.log(user['name'])
                console.log(document.getElementById('userasda'))

                var x = document.getElementById('vehicle')


                console.log(vehicles)

                vehicles.forEach((data)=>{
                    var option = document.createElement("option");
                    option.value = data.code;
                    option.text = data.name;
                    x.add(option);
                    document.getElementById("vehicle-info").innerHTML +=
                        '<div class="badge bg-blue-fade font-10 p-2  ml-n3 mt-n4 mr-3 mb-1">'+data.code + ' : ' + data.name+'</div>' + "\n"
                })



                console.log(document.getElementById('barcode_no'))
                console.log(document.getElementById(''))
                replaceText(`user.name`, user['name'])
                function blank(e) {
                    switch (e) {
                        case "":
                        case 0:
                        case "0":
                        case null:
                        case false:
                        case undefined:
                            return true;
                        default:
                            return false;
                    }
                }

                var _timeoutHandler = 0,
                    _inputString = '',
                    _onKeypress = function(e) {
                    let vehicle = $('#vehicle').val()
                    let barcode_no = $('#barcode_no').val()
                    let plat_no = $('#plat_no').val()

                        if (_timeoutHandler) {
                            clearTimeout(_timeoutHandler);
                            console.log('manual input')
                        }

                        console.log(document.getElementById('barcode_no').value == '')
                        if (e.keyCode !== 13){
                            _inputString += e.key;
                        } else{

                            e.preventDefault();
                            e.target.blur();
                            document.activeElement.blur();

                            if(!blank(vehicle) && !blank(barcode_no) && !blank(plat_no) ){
                                getTicket()
                            }
                        }

                        console.log('tag',$(e.target).prop("tagName"))

                        if ($(e.target).attr('id') !== 'description'){
                            console.log(e.keyCode)
                        }

                        console.log(e.key,vehicles,_timeoutHandler)
                        if ($(e.target).prop("tagName").toLowerCase() === 'body'){
                            vehicles.forEach((vehicle) =>{
                                if (e.key.toLowerCase() === vehicle.code.toLowerCase()){
                                    document.getElementById('vehicle').value = vehicle.code
                                }
                            })
                        }


                        // if (e.keyCode === 113) {
                        //     document.getElementById('vehicle').value = 1
                        // }
                        // if (e.keyCode === 119) {
                        //     document.getElementById('vehicle').value = 2
                        // }
                        // if (e.keyCode === 101) {
                        //     document.getElementById('vehicle').value = 3
                        // }
                        // if (e.keyCode === 114) {
                        //     document.getElementById('vehicle').value = 4
                        // }
                        // if (e.keyCode === 116) {
                        //     document.getElementById('vehicle').value = 5
                        // }
                        // if (e.keyCode === 121) {
                        //     document.getElementById('vehicle').value = 6
                        // }
                        // if (e.keyCode === 117) {
                        //     document.getElementById('vehicle').value = 7
                        // }

                        _timeoutHandler = setTimeout(function () {
                            if (_inputString.length <= 3) {
                                _inputString = '';
                                return;
                            }
                            document.getElementById('barcode_no').value = _inputString
                            if ($(e.target).attr('id') !== 'barcode_no'){
                                $(e.target).val($(e.target).val().slice(0,(_inputString, $(e.target).val().length - _inputString.length)))
                            }

                            _inputString = '';

                        }, 20);
                    };

                $('body').on({
                    keypress: _onKeypress
                });
            })($);

        })


    })

;

ipcRenderer.on('user', function (event, args) {
    console.log('aaa', event, args)
    a = args
})


