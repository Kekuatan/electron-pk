// Modules to control application life and create native browser window
const { app, BrowserWindow, protocol, ipcMain} = require("electron");
const path = require("path");


var HomeWindow = require('./app/Windows/HomeWindow.js')
var TicketPrintingWindow = require('./app/Windows/TicketPrintingWindow.js')
const {CaptureImageService} = require("./app/Services/CaptureImageService");
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


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // CaptureImageWindow.createWindows()
    CaptureImageService.takeImage()
    HomeWindow.createWindows()
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
