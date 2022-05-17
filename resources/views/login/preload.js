// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const {contextBridge, ipcRenderer} = require("electron");



contextBridge.exposeInMainWorld(
    "api", {
        login: async (payload) => {
            return await ipcRenderer.invoke('login', payload).then((result) => {
                return result
            })
        },
        send: (channel, data) => {
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




const crypto = require('crypto')
contextBridge.exposeInMainWorld('nodeCrypto', {
    sha256sum (data) {
        const hash = crypto.createHash('sha256')
        hash.update(data)
        return hash.digest('hex')
    }
})



window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }
})
