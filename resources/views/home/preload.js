// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const {contextBridge, ipcRenderer} = require("electron");
const serialport = require('serialport')
const tableify = require('tableify')
const ByteLength = require('@serialport/parser-byte-length')
const Readline = require('@serialport/parser-readline')
const {StorageService} = require("../../../app/Services/Storage/StorageService");

const port = new serialport('COM4',
    {
        echo: true,
        record: true,
        baudRate: 9600,
        dataBits : 8,
        parity:'none',
        stopBits: 1,
        rtscts: false
    })


const path = require("path");
var pathToFfmpeg = require('ffmpeg-static');

const shell = require('any-shell-escape')
const {exec} = require('child_process')
console.log(pathToFfmpeg);

// process.exit(1)
const makeMp3 = shell([
    pathToFfmpeg,
    // '-ss', '1',
    // 'error',

    '-i', 'rtsp://admin:admin@192.168.110.51:554',
    // '-q:v', '4',
    '-frames:v', '1', '-q:v', '2',
    '-strftime','1',
    path.join('Z:', '%Y-%m-%d_%H-%M-%S.jpg'),
])




// const parser = port.pipe(new Readline());

// parser.on('readable', function () {
//     console.log('Data readable:', port.read())
// })
//
// // Switches the port into "flowing mode"
// parser.on('data', function (data) {
//     console.log('Data data:', data)
// })
//
// port.on('readable', function () {
//     console.log('Data port readable:', port.read())
// })

let a = StorageService.getFromStorage('access_token')
let b = StorageService.getFromStorage('user')
console.log('go to aa ',a)
console.log('go to bb ',b)
// Switches the port into "flowing mode"
port.on('data', function (data) {
    console.log('Data port  data:', data)
    console.log('Data port  data:', data.toString())
    let a = async  (someArgument) => {
        return await ipcRenderer.invoke('some-name', someArgument).then((result) => {
            return result
        })
    }

    if (data.toString() == '*IN1ON#'){
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
                ipcRenderer.on('fromMain', function(){
                    return 'apalah'
                })
               // ipcRenderer.on(channel, (event, args) => func(...args));
            }
        }
    }
);


ipcRenderer.on('user', function(event, args){
    console.log('aaa',event,args)
    a = args
})


const crypto = require('crypto')
contextBridge.exposeInMainWorld('nodeCrypto', {
    sha256sum (data) {
        const hash = crypto.createHash('sha256')
        hash.update(data)
        return hash.digest('hex')
    }
})



window.addEventListener('DOMContentLoaded', () => {
    // console.log(a)
  const replaceText = (selector, text) => {
      for (const key in user) {
          const element = document.getElementById('user.shift')
          if (element) element.innerText = text
      }

      for (const type of ['chrome', 'node', 'electron']) {
          replaceText(`${type}-version`, process.versions[type])
      }
  }
})
