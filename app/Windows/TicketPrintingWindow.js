const {app, BrowserWindow, protocol, ipcMain} = require("electron");
var windowsDefault = require('./Extends/DefaultSettingWindow')
const path = require("path");
const XMLHttpRequest = require('xhr2');
const {TicketData} = require("../../app/Services/TicketData");
const {NFCService} = require("../../app/Services/NFC/NFCService");

const {AuthBasicService} = require("../../app/Services/Api/AuthBasicService");
const {ApiConnectionService} = require("../../app/Services/Api/ApiConnectionService");
const {ConfigEnum} = require("../../app/Enums/ConfigEnum");

class TicketPrintingWindow extends windowsDefault {
    constructor() {
        super({
            width: '839px',
            height: '483px',
            webPreferences: {
                preload: path.join(process.cwd(), 'resources', 'views', 'ticket', 'ticket.js')
            },
            frame: false,
            win: false
        })

        this.data = []
        this.eventClickButton()
        this.nfcRun()
        this.view = path.join(process.cwd(), 'resources', 'views', 'ticket', 'ticket.html');

        //mainWindow.webContents.openDevTools()
        //this.win.loadFile(path.join(__dirname, 'resources', 'views', 'ticket', 'ticket.html'));
    }

    nfcRun() {
        NFCService.nfc.on('reader', reader => {
            reader.on('card', card => {
                // card is object containing following data
                // [always] String type: TAG_ISO_14443_3 (standard nfc tags like MIFARE) or TAG_ISO_14443_4 (Android HCE and others)
                // [always] String standard: same as type
                // [only TAG_ISO_14443_3] String uid: tag uid
                // [only TAG_ISO_14443_4] Buffer data: raw data from select APDU response
                console.log(`${reader.reader.name}  card detected`, card);
                this.print()
            });
        })
    }


    auth = () => {
        return new Promise((resolve, reject) => {
            if (reject) {
                console.log(reject)
            }
            const key = AuthBasicService.basiAuth()
            key.onload = () => {
                console.log('DONE: ', key.status);
                AuthBasicService.access_token = JSON.parse(key.responseText).access_token;
                ApiConnectionService.token = AuthBasicService.access_token
                console.log(AuthBasicService.access_token)
                resolve()
            };

        })
    }


    async eventClickButton() {
        console.log('await auth')
        await this.auth()
        console.log('auth done')
        this.print = async (event, someArgument) => {
            //const result = await doSomeWork(someArgument)
            //return mainWindow.webContents.getPrinters()


            const saveFile = () => {
                return new Promise((resolve, reject) => {
                    TicketData.generateData(this.response, (data, barcode_data_img) => {
                        this.data = data
                        resolve()
                    });
                })
            }

            const api = () => {
                const d = new Date( +new Date - 10000 );

                let second = (d.getSeconds())*1 >= 10 ? d.getSeconds() :  '0' + d.getSeconds() ;
                return new Promise((resolve, reject) => {
                    const key = ApiConnectionService.axios('/api/ticket/in', 'POST',
                        {
                            'picture_vehicle_in': '/picture-vehicle-in/'+second+'.jpg',
                            'area_position_in_id': ConfigEnum.area_position_in_id
                        }
                    )
                    key.then((response) => {
                        console.log('ticket create success')
                        this.response = response.data;
                        console.log(this.response)
                        resolve()
                    }).catch((error) => {
                        console.log('ticket create failed')
                        console.log(error.message)
                        console.log(error.response.data);
                        resolve()
                    });
                })
            }


            console.log('hashfsafh')
            await api()
            await saveFile()


            console.log(this.response)
            if (!this.win) {
                this.win = new BrowserWindow();
                this.win.webContents.openDevTools()
            } else {
                this.win.close();
                this.win = new BrowserWindow();
                this.win.webContents.openDevTools()
            }

            this.win.loadFile(this.view, {
                query: {queryKey: JSON.stringify(this.data)},
                hash: "hashValue",
            });


            var options = {
                silent: true,
                printBackground: false,
                color: false,
                margin: {
                    marginType: 'custom',
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0
                },
                pageSize: 'A5',
                landscape: false,
                pagesPerSheet: 1,
                collate: false,
                copies: 1,
            }
            setTimeout(() => {
                console.log('Print Initiated');
                this.win.webContents.print(options, (success, failureReason) => {
                    console.log(success);
                    console.log(failureReason);
                    if (!success) {
                        console.log('Print failled');
                        console.log(failureReason);
                    } else {
                        if (this.win) {
                            // setTimeout(()=> {
                            //     this.win.close();
                            // }, 200)
                        }
                        console.log('Print success');
                        return this.data
                    }


                });


            }, 500)


        }
    }


}

module.exports = new TicketPrintingWindow()