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
const {Store} = require("./app/Services/Storage/StorageService");
const {ConfigEnum} = require("./app/Enums/ConfigEnum");
var SplashScreenWindow = require('./app/Windows/SplashScreenWindow.js')
var LoginWindow = require('./app/Windows/LoginWindow.js')
const {CaptureImageService} = require("./app/Services/CaptureImageService");
let activeWindow = null;
// var CaptureImageWindow = require('./app/Windows/CaptureImageWindow.js')

// const argv = process.argv.slice(2)
// if (argv.includes('-h') || argv.includes('--help')) {
//     console.info(`
// This is just a simple CLI wrapper around the powerful ffmpeg CLI tool.
// This script just showcases how to use ffmpeg-static; It wouldn't make
// sense to hide a flexible tool behind a limited wrapper script.
// Usage:
// 	./example.js <src> <dest>
// Example:
// 	./example.js src-audio-file.m4a dest-audio-file.mp3
// `)
//     process.exit(0)
// }
//
// const [src, dest] = argv
// if (!src) {
//     console.error('Missing <src> positional argument.')
//     process.exit(1)
// }
// if (!dest) {
//     console.error('Missing <dest> positional argument.')
//     process.exit(1)
// }

// console.log(HomeWindow)
// windows
// let ticketWindow = null;
// let cameraWindows = null
// let mainWindow = null
//
// function createWindow() {
//     // Create the browser window.
//
//     mainWindow = new BrowserWindow({
//         width: '839px',
//         height: '483px',
//         webPreferences: {
//             preload: path.join(__dirname, 'resources', 'views', 'home', 'preload.js')
//            },
//         frame: false
//     });
//     //mainWindow.webContents.openDevTools()
//     mainWindow.loadFile(path.join(__dirname, 'resources', 'views', 'home', 'home.html'));
//     // mainWindow.maximize();
//     mainWindow.setMenu(null);
//     // Open the DevTools.
//     mainWindow.webContents.openDevTools()
//
//
//     // workerWindow.webContents.openDevTools();
//     // workerWindow.on("closed", () => {
//     //   workerWindow = null;
//     // });
//
// }
const store = new Store({
    // We'll call our data file 'user-preferences'
    configName: 'parkir-client',
    defaults: {
        // 800x600 is the default size of our window
        windowBounds: { width: 800, height: 600 }
    }
});
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


ipcMain.handle('login', async (event,payload)=>{
    const login = () => {
        return new Promise((resolve, reject) => {
            console.log('main')
            console.log(payload)
            const key = ApiConnectionService.axios('/api/login', 'POST',
                {
                    'email': payload.email,
                    'password': payload.password
                }
            )
            key.then((response) => {
                console.log('ticket create success')
                this.response = response.data;
                // ConfigEnum.access_token = response.data.access_token
                StorageService.saveToStorage('access_token', response.data.access_token??null)
                StorageService.saveToStorage('user', response.data.user??null)
                console.log(ConfigEnum.access_token)

                HomeWindow.createWindows()
                console.log('splash done')
                activeWindow.win.close();
                console.log('home open')
                activeWindow = HomeWindow
                if (activeWindow.win) {
                    console.log('go')
                    HomeWindow.win.webContents.send('user',response.data.user )
                    // HomeWindow.win.webContents.send('fromMain', 'ARGS')
                }
                resolve()
            }).catch((error) => {
                StorageService.saveToStorage('access_token', null)
                console.log('ticket create failed')
                // ConfigEnum.access_token = null
                console.log(error.message)
                console.log(error.response.data);

                resolve()
            });
        })
    }

    await login()

})



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    console.log('splash')
    activeWindow = SplashScreenWindow
    activeWindow.createWindows()
    activeWindow.win.on('ready-to-show', () => {
        activeWindow.win.show();
    })
    activeWindow.win.webContents.on('did-finish-load', () => {
        // splashPage.webContents.send('logo-change', client_state_object.LOGO);
        let isLogging = StorageService.getFromStorage('access_token')
        if (isLogging = false) {
            activeWindow.win.webContents.send('credentials-check', '1');
        } else {
            setTimeout(() => {
                LoginWindow.createWindows()
                console.log('splash done')
                activeWindow.win.close();
                activeWindow = LoginWindow
            }, 3000);
        }
    })
    // CaptureImageWindow.createWindows()
    // CaptureImageService.takeImage()
    // HomeWindow.createWindows()
    // protocol.registerSchemesAsPrivileged([
    //   {
    //     privileges: {standard: true, secure: true}
    //   }
    // ])
    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
    app.on("closed", function () {
       console.log('closed')
    });

    // LoginWindow.win.on("ready", function () {
    //     console.log('raeafafs')
    //     protocol.registerFileProtocol('file', (request, cb) => {
    //         console.log(request)
    //         const url = request.url.replace('file:///', '')
    //         const decodedUrl = decodeURI(url)
    //         try {
    //             return cb(decodedUrl)
    //         } catch (error) {
    //             console.error('ERROR: registerLocalResourceProtocol: Could not get file path:', error)
    //         }
    //     })
    // });





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
