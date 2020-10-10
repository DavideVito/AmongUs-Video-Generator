const { spawn } = require('child_process');
const ffmpeg = require('fluent-ffmpeg');
const imagic = require('imagemagick');
const { mkdir } = require("fs").promises
const uuid = require("uuid").v4
let cartelle = [];
let nome = uuid();











ffmpeg()
    .input("Video/background.mp4")
    .input("Video/giallo.mp4")

    .complexFilter(
        [
            "[1:v]colorkey=0x00ff00:0.3:0.2[ckout]",
            "[0:v][ckout]overlay=x='if(gte(t,0), -w+(t)*400, 3)':y=(H-h)/2",
        ])
    .output(`tmp/${nome}.mp4`).on("error", console.log).on("end", async (a) => {

        let cartella = await generaImmagini("Hello World");
        ffmpeg()
            .input(`tmp/${cartella}/img-%03d.png`)
            .outputOption("-framerate 30")
            .duration("5")
            .videoFilter("setpts=5.0*PTS")
            .outputOption("-pix_fmt yuv420p")
            .output(`tmp/${cartella}/scritta.mp4`).on("error", console.log).on("end", () => {


                let command = ffmpeg().input(`tmp/${nome}.mp4`).input(`tmp/${cartella}/scritta.mp4`)

                    .complexFilter(
                        [
                            "[1:v]colorkey=0x000000:0.3:0.2[ckout]",
                            "[0:v][ckout]overlay=(W-w)/2:(H-h)/2"
                        ])
                    .audioCodec("copy")
                    .output(`Final/${nome}.output.mp4`);

                command.on('start', function (commandLine) {
                    console.error('Spawned Ffmpeg with command: ' + commandLine);
                });
                command.duration("5s")

                command.run();

                //spawn(`open Final/${nome}.output.mp4`)

            }).run()











    }).run();

async function generaImmagini(testo) {

    let nomeCartella = uuid()

    cartelle.push({ nome: nomeCartella, data: Date() });

    mkdir("tmp/" + nomeCartella)

    let t = testo.split("");
    let promises = []

    let letterePrec = "";
    for (let i = 0; i < t.length; i++) {
        let lettera = t[i];
        letterePrec += lettera;
        let n = aggiungi0(i);
        let p = convertiImmagine(["Assets/Images/green.png", "-gravity", "Center", "-pointsize", "30", "-font", "Assets/font.ttf", "-fill", "white", "-pointsize", "80", "-annotate", "0", `${letterePrec}`, `tmp/${nomeCartella}/img-${n}.png`])
        promises.push(p)
    }

    await Promise.all(promises)


    return nomeCartella;















}

function convertiImmagine(args) {
    return new Promise((resolve, reject) => {
        imagic.convert(args, (err, data) => {
            if (err) {
                return reject(err);
            }

            resolve(data);
        });
    });
}

function aggiungi0(num) {
    var str = "" + num
    var pad = "000"
    var ans = pad.substring(0, pad.length - str.length) + str
    return ans
}