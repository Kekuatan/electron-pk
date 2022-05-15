// Modules to control application life and create native browser window
const { app, BrowserWindow, protocol, ipcMain} = require("electron");
const path = require("path");


// windows
let ticketWindow = null;
let cameraWindows = null
let mainWindow = null

function createWindow() {
    // Create the browser window.

    mainWindow = new BrowserWindow({
        width: '839px',
        height: '483px',
        webPreferences: {
            preload: path.join(__dirname, 'resources', 'views', 'home', 'preload.js')
           },
        frame: false
    });
    //mainWindow.webContents.openDevTools()
    mainWindow.loadFile(path.join(__dirname, 'resources', 'views', 'home', 'home.html'));
    // mainWindow.maximize();
    mainWindow.setMenu(null);
    // Open the DevTools.
    mainWindow.webContents.openDevTools()


    // workerWindow.webContents.openDevTools();
    // workerWindow.on("closed", () => {
    //   workerWindow = null;
    // });

}


ipcMain.handle('some-name', async (event, someArgument) => {
    //const result = await doSomeWork(someArgument)
    //return mainWindow.webContents.getPrinters()



    let b = ''
    const saveFile = () => {
        return new Promise((resolve, reject) => {
            TicketData.generateData((data, barcode_data_img) => {
                b = data
                resolve()
            });
        })
    }
    await saveFile()


    ticketWindow = new BrowserWindow();
    ticketWindow.webContents.openDevTools()

    ticketWindow.loadFile(path.join(__dirname, 'resources', 'views', 'ticket', 'ticket.html'), {
        query: {queryKey: JSON.stringify(b)},
        hash: "hashValue",
    });

    var options = {
        silent: false,
        printBackground: true,
        color: false,
        margin: {
            marginType: 'printableArea'
        },
        landscape: false,
        pagesPerSheet: 1,
        collate: false,
        copies: 1,
        header: 'Header of the Page',
        footer: 'Footer of the Page'
    }

    return b

    // workerWindow.webContents.print(options, (success, failureReason) => {
    //   if (!success) {
    //     console.log(failureReason);
    //   } else{
    //     workerWindow.close();
    //   }
    //
    //   console.log('Print Initiated');
    // });

})


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

    createWindow();
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


});


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
