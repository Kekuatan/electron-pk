var windowsDefault = require('./Extends/DefaultSettingWindow')
const fs = require("fs");

const { app, BrowserWindow, protocol, ipcMain} = require("electron");
const path = require("path");

class CaptureImageWindow extends windowsDefault{
    constructor() {
        super({width: 800, height: 600,
            show: true, // or true
            win: false,
            webPreferences: {
                nodeIntegration: true}})
        this.view = path.join(process.cwd(), 'resources', 'views', 'capture-image', 'capture-image.html')
        //this.win.loadURL(windowsEnum.view["capture-image"]);
        // this.eventClickButton()
    }


    eventClickButton( ) {
        console.log('try to capture image')
        console.log(this.win)
        this.capture = async () => {
            console.log('-- loading')
            try {
                await this.win.capturePage()
                    .then(image => {
                        fs.writeFileSync('test.png', image.toPNG(), (err) => {
                            if (err) console.log( err)
                        })
                    })
            } catch (e) {
                console.log(e)
            }
        };
        this.capture()
        console.log('done try to capture image')
    }
}

module.exports = new CaptureImageWindow()