const ffmpeg = require('fluent-ffmpeg');

const uuid = require("uuid").v4

let nome = uuid();
console.log(nome)

ffmpeg()
    .input("Video/background.mp4")
    .input("Video/giallo.mp4")

    .complexFilter(
        [
            "[1:v]colorkey=0x00ff00:0.3:0.2[ckout]",
            "[0:v][ckout]overlay=x='if(gte(t,0), -w+(t)*400, 3)':y=(H/2)-225",
        ])
    .output(`tmp/${nome}.mp4`).on("error", console.log).on("end", async (a) => {
        console.log(a)

        let command = ffmpeg().input(`tmp/${nome}.mp4`)
            .videoFilters(`drawtext=fontfile='Assets/font.ttf':text='Benito Mussolini was not the imposter':x=(w-text_w)/2:y=(H/2+125):fontsize=58:fontcolor=white:enable='between(t, 0, 5)'`)
            .audioCodec("copy")
            .output(`Final/${nome}.output.mp4`);

        command.on('start', function (commandLine) {
            console.error('Spawned Ffmpeg with command: ' + commandLine);
        });
        command.duration("5s")

        command.run();






    }).run();



