
const { app, BrowserWindow, protocol, ipcMain} = require("electron");
const path = require("path");

class windowsDefault {
    constructor(config) {
        config = config ? config : {
            webPreferences: {
                show: true, // or true
            }
        }
        config.width = 1500
        config.height = 600
        this.config = config
        //this.win = new BrowserWindow(config)

    }

    createWindows (){
        this.win = new BrowserWindow(this.config)
        this.win.loadFile(this.view)
        this.initWindows()
    }

    initWindows() {
        this.win.openDevTools();
        this.win.on('closed', function() {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            //this.win = null;
            //cameraView.close()
            //cameraView = null;
        });
        // mainWindow.maximize();
        this.win.setMenu(null);
        // Open the DevTools.
        // this.win.webContents.openDevTools()
    }
}

module.exports = windowsDefault;