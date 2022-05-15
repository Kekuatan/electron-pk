
const path = require("path");
var pathToFfmpeg = require('ffmpeg-static');

const shell = require('any-shell-escape')
const {exec,spawn} = require('child_process')
const {app} = require("electron");
console.log(pathToFfmpeg);

// process.exit(1)

class CaptureImageService {
    constructor() {
        this.oneCaptureButDelay = [
            pathToFfmpeg,
            // '-ss', '1',
            // 'error',

            '-i', 'rtsp://admin:admin@192.168.110.51:554',
            // '-q:v', '4',
            '-frames:v', '1', '-q:v', '2',
            '-strftime','1',
            path.join(__dirname,'/picture-vehicle-in/%Y-%m-%d_%H-%M-%S.jpg'),
        ]

        console.log(path.join(__dirname,'picture-vehicle-in/%Y-%m-%d_%H-%M-%S.jpg'));
        this.killFfmpeg =
            ['tasklist'
            //'| find /i "ffmpeg.exe" && taskkill /im ffmpeg.exe /F || echo process "ffmpeg.exe" not running'
            ]


        this.continueCapturePerSecond  = [
            pathToFfmpeg,
            '-y',
            '-i',  'rtsp://admin:admin@192.168.110.51',
            '-vf',
            'fps=1',
            '-loglevel', 'quiet',
            '-strftime', '1',
            path.join(__dirname,'../../picture-vehicle-in/%S.jpg')
        ]

        this.makeMp3 = shell(this.continueCapturePerSecond)
    }

    takeImage(){

        this.ffmpegProcess  = exec(this.makeMp3, (err) => {
            if (err) {
                console.error(err)
                process.exit(1)
            } else {
                console.info('done!')
            }
        })

    }

}

// now we export the class, so other modules can create Cat objects
module.exports = {
    CaptureImageService: new CaptureImageService()
}
