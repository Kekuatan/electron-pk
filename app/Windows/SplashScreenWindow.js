var windowsDefault = require('./Extends/DefaultSettingWindow')
const path = require("path");
const {BrowserWindow} = require("electron");

class SplashScreenWindow extends windowsDefault{
    constructor() {
        super({
            width: '839px',
            height: '483px',
            webPreferences: {
                preload: path.join(process.cwd(), 'resources', 'views', 'splash-screen', 'preload.js')
            },
            frame: false
        })

        //mainWindow.webContents.openDevTools()
        this.view = path.join(process.cwd(), 'resources', 'views', 'splash-screen', 'splash-screen.html')
        //this.win.loadFile(path.join(__dirname, 'resources', 'views', 'home', 'home.html'));
    }

}

module.exports = new SplashScreenWindow()


