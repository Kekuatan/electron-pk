var windowsDefault = require('./Extends/DefaultSettingWindow')
const path = require("path");
const {BrowserWindow, ipcMain, ipcRenderer} = require("electron");
const {ApiConnectionService} = require("../Services/Api/ApiConnectionService");
const electron = require("electron");
const StorageService = require(path.join(process.cwd(), 'app', 'Services', 'Storage', 'StorageService.js'))
const Store = new StorageService()

class LoginWindow extends windowsDefault{
    constructor() {
        super({
            width: '839px',
            height: '483px',
            webPreferences: {
                preload: path.join(process.cwd(), 'resources', 'views', 'login', 'preload.js')
            },
            frame: false
        })
        this.init()
        //mainWindow.webContents.openDevTools()
        this.view = path.join(process.cwd(), 'resources', 'views', 'login', 'login.html')
        //this.win.loadFile(path.join(__dirname, 'resources', 'views', 'home', 'home.html'));

    }
    init(){
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
                        console.log(response.data.user)
                        this.response = response.data;

                        // Set Token to local data
                        Store.set('access_token', response.data.access_token??null)
                        Store.set('user', response.data.user??null)

                        // Set Token to service
                        ApiConnectionService.setToken(response.data.access_token)

                        // Close and set current active window
                        ipcMain.emit('renew-active-win', 'HomeWindow', {
                            'user.name' :  Store.get('user').name??null,
                            'user.shift' :  Store.get('user').description??null,
                        })

                        resolve()
                    }).catch((error) => {
                        Store.set('access_token', null)
                        ApiConnectionService.setToken(null)

                        console.log('login failed')
                        console.log(error.message)
                        console.log(error.response.data);

                        resolve()
                    });
                })
            }

            await login()
        })

    }
}

module.exports = new LoginWindow()

