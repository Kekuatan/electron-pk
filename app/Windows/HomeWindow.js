var windowsDefault = require('./Extends/DefaultSettingWindow')
const path = require("path");

class HomeWindow extends windowsDefault{
    constructor() {
        super({
            width: '839px',
            height: '483px',
            webPreferences: {
                preload: path.join(process.cwd(), 'resources', 'views', 'home', 'preload.js')
            },
            frame: false
        })

        this.eventClickButton()
        //mainWindow.webContents.openDevTools()
        this.view = path.join(process.cwd(), 'resources', 'views', 'home', 'home.html')
        //this.win.loadFile(path.join(__dirname, 'resources', 'views', 'home', 'home.html'));
    }

    eventClickButton( ) {

    }


}

module.exports = new HomeWindow()