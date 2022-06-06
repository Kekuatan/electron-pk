// Modules to control application life and create native browser window
const { app, BrowserWindow, protocol, ipcMain} = require("electron");
const path = require("path");

require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
});





var HomeWindow = require('./app/Windows/HomeWindow.js')
var TicketPrintingWindow = require('./app/Windows/TicketPrintingWindow.js')
const {ApiConnectionService} = require("./app/Services/Api/ApiConnectionService");
const StorageService = require("./app/Services/Storage/StorageService");
const {ConfigEnum} = require("./app/Enums/ConfigEnum");
var SplashScreenWindow = require('./app/Windows/SplashScreenWindow.js')
var LoginWindow = require('./app/Windows/LoginWindow.js')
const {CaptureImageService} = require("./app/Services/CaptureImageService");

const electron = require("electron");
let activeWindow = null;
const Store = new StorageService()
const windows = {
    'LoginWindow' : LoginWindow,
    'HomeWindow' : HomeWindow,
    'SplashScreenWindow' : SplashScreenWindow
}
console.log(Store.get('windowBounds')['width'])
console.log(Store.get('access_token'))

app.allowRendererProcessReuse=false


ipcMain.handle('some-name', async ()=>{
    const saveFile = () => {
        return new Promise((resolve, reject) => {

            // CaptureImageWindow.capture()
            resolve()
        })
    }
    await saveFile()
    TicketPrintingWindow.print()
})



ipcMain.handle('read-user-data', async (event) => {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    return userDataPath;

})

ipcMain.on('renew-active-win', async ( currentWindow,response) => {
    console.log('show : ' + currentWindow)
    currentWindow = windows[currentWindow]
    if (currentWindow == activeWindow){
        activeWindow.win.reload(response);
    } else {
        if(response){
            currentWindow.createWindows(response)
        }
        activeWindow.win.close();
        activeWindow = currentWindow
    }


})





// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async() => {
    console.log('splash')
    activeWindow = SplashScreenWindow
    activeWindow.createWindows({}, false)
    const vehicles = () => {
        return new Promise((resolve, reject) => {

            const key = ApiConnectionService.axios('/api/vehicles', 'GET')
            key.then((response) => {
                console.log('vehicles get success')
                // Set Token to local data
                Store.set('vehicles',response.data ?? [])
                console.log(Store.get('vehicles'))
                resolve()
            }).catch((error) => {
                console.log('get vehicles failed')
                console.log(error.message)
                console.log(error.response.data);
                resolve()
            });
        })
    }

    await vehicles()
    activeWindow.win.on('ready-to-show', () => {
        activeWindow.win.show();
    })
    activeWindow.win.webContents.on('did-finish-load', () => {
        // splashPage.webContents.send('logo-change', client_state_object.LOGO);
        // let isLogging = StorageService.getFromStorage('access_token')
        if (isLogging = false) {
            activeWindow.win.webContents.send('credentials-check', '1');
        } else {
            setTimeout(() => {
                LoginWindow.createWindows({}, false)
                console.log('splash done')
                activeWindow.win.close();
                activeWindow = LoginWindow
            }, 3000);
        }
    })

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
    app.on("closed", function () {
       console.log('closed')
    });

});


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
    console.log('try to close')
    CaptureImageService.ffmpegProcess.stdin.write('q')

    if (process.platform !== "darwin") {
        var cmd = 'ffmpeg...'
        var child = exec(cmd, function(err, stdout, stderr) {})
        child.stdin.write('q')
        app.quit();
    }

});
app.on("exit", function () {
    CaptureImageService.ffmpegProcess.stdin.write('q')
    console.log('closed')
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
