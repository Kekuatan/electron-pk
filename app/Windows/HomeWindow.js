var windowsDefault = require('./Extends/DefaultSettingWindow')
const { app, BrowserWindow, protocol, ipcMain} = require("electron");
const path = require("path");
const electron = require("electron");
const {ApiConnectionService} = require("../Services/Api/ApiConnectionService");
const StorageService = require(path.join(process.cwd(), 'app', 'Services', 'Storage', 'StorageService.js'))
const Store = new StorageService()

class HomeWindow extends windowsDefault{
    constructor() {
        super({
            width: '839px',
            height: '483px',
            webPreferences: {
                preload: path.join(process.cwd(), 'resources', 'views', 'home', 'preload.js')
            },
            frame: false,
        })

        this.init()
        //mainWindow.webContents.openDevTools()
        this.view = path.join(process.cwd(), 'resources', 'views', 'home', 'home.html')
        //this.win.loadFile(path.join(__dirname, 'resources', 'views', 'home', 'home.html'));
    }

    init( ) {
        ipcMain.handle('ticket-get', async (event,payload)=>{
            let data = null
            const ticketOut = () => {
                return new Promise((resolve, reject) => {
                    console.log('payload : ', payload)
                    const key = ApiConnectionService.axios('/api/ticket/get', 'POST',
                        {
                            'barcode_no': payload.barcode_no ?? '',
                            'password': payload.vehocle_picture_out ?? ''
                        }
                    )
                    key.then((response) => {
                        console.log('ticket get success')
                        console.log(response.data)
                        // ipcMain.emit('renew-active-win', 'HomeWindow', {
                        //     'user.name' :  Store.get('user').name??null,
                        //     'user.shift' :  Store.get('user').description??null,
                        //     'ticket.created_at' : ''
                        // })
                        data = response.data
                        resolve()
                    }).catch((error) => {
                        console.log('ticket create failed')
                        console.log(error.message)
                        console.log(error.response.data);
                        data = response.data
                        resolve()
                    });
                })
            }

            await ticketOut()
            return data
        })

    }


}

module.exports = new HomeWindow()