const {app, BrowserWindow, protocol, ipcMain} = require("electron");
const path = require("path");
const fs = require("fs");
const electron = require("electron");

class windowsDefault {
    constructor(config) {
        config = config ? config : {
            webPreferences: {
                show: true, // or true
            }
        }
        config.width = 1600
        config.height = 800
        this.config = config
        this.template = path.join(process.cwd(), 'resources', 'views', 'template', 'template.html')
        this.header = path.join(process.cwd(), 'resources', 'views', 'template', 'header.html')
        this.footer = path.join(process.cwd(), 'resources', 'views', 'template', 'footer.html')
        this.view = path.join(process.cwd(), 'resources', 'views', 'splash-screen', 'splash-screen.html')
        //this.win = new BrowserWindow(config)

    }

    interpolate(str='', data={}) {
        let config = {
            templateGlobals: {
                'appName': "Geologies",
            }
        }

        // Set global parameter
        for (let keyName in config.templateGlobals) {
            if (config.templateGlobals.hasOwnProperty(keyName)) {
                data['global.' + keyName] = config.templateGlobals[keyName];
            }
        }

        // Replaace string
        for (let key in data) {
            if (data.hasOwnProperty(key) && typeof (data[key]) == 'string') {
                let replace = data[key]
                let find = '{{' + key + '}}'
                str = str.replace(find, replace)
            }
        }
        return str
    }

    getTemplate (templateDir, data={}, callback){
        if ( templateDir){
            // Read that file on path directory
            fs.readFile(templateDir, 'utf8', (err,str)=>{
                if (!err && str && str.length > 0){
                    // Replace string with data
                    console.log(data)
                    let finalString = this.interpolate(str,data)
                    callback(false,finalString)
                } else {
                    callback('No template could be found')
                }
            })
        } else {
            callback ('A valid template name not specified')
        }
    }

    replaceTemplate(stringData,callback){
            // Open file
            fs.open(this.template,'w', function(err, fileDescriptor){
                if (!err && fileDescriptor){
                    // Write file
                    fs.writeFile(fileDescriptor,stringData,function(err){
                        if (!err){
                            // Close file
                            fs.close(fileDescriptor, function(err){
                                if (!err){
                                    callback(false, 'replace template success')
                                } else {
                                    callback ('Error Closing new file')
                                }
                            })
                        } else {
                            callback ('Error writing new file')
                        }
                    })
                } else {
                    callback('Could not create new file, it already exist or path cant find')
                }
            })
    }


    createWindows(data={}, withTemplate= true ) {
        this.win = new BrowserWindow(this.config)
        let str = ''
        if (withTemplate){
            this.getTemplate(this.header,data , (err, finalString) => {
                if (err){
                    console.log(err)
                } else{
                    str = str + finalString
                    this.getTemplate(this.view, data, (err, finalString) => {
                        if (err){
                            console.log(err)
                        } else{
                            str = str + finalString
                            this.getTemplate(this.footer, data, (err, finalString) => {
                                if (err){
                                    console.log(err)
                                } else{
                                    str = str + finalString
                                    this.replaceTemplate(str, (err, response) => {
                                        if (err){
                                            console.log(err)
                                        } else{
                                            this.win.openDevTools(this.view)
                                            this.win.loadURL(this.template)
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })

        } else {
            this.win.openDevTools(this.view)
            this.win.loadURL(this.view)
        }

    }

    initWindows() {
        this.win.openDevTools();
        this.win.on('closed', function () {
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