
const ffmpeg = require('fluent-ffmpeg');
const imagic = require('imagemagick');
const { mkdir, rmdir, unlink } = require("fs").promises
const removeDir = require("rimraf");
const uuid = require("uuid").v4
let cartelle = [];





async function convertVideo(nome, testo, colore) {
    let cartella = await generaImmagini(testo, nome);

    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(`tmp/${cartella}/img-%03d.png`)
            .outputOption("-framerate 30")
            .videoFilter("setpts=3.0*PTS")
            .outputOption("-pix_fmt yuv420p")
            .output(`tmp/${cartella}/scritta.mp4`).on("error", console.log).on("end", async () => {

                ffmpeg()
                    .input("Video/background.mp4")
                    .input(`tmp/${cartella}/scritta.mp4`)
                    .inputOption("-itsoffset 3")
                    .input("Assets/morse.m4a")
                    .inputOption("-itsoffset 3")
                    .complexFilter(
                        [
                            "[1:v]colorkey=0x1f8800:0.5:0.2[ckout]",
                            "[0:v][ckout]overlay=(W-w)/2:(H-h)/2"
                        ])
                    .audioCodec("copy")
                    .output(`tmp/${cartella}/${nome}.tmp.mp4`).on("end", () => {

                        ffmpeg()
                            .input(`tmp/${cartella}/${nome}.tmp.mp4`)
                            .input(`Video/${colore}.mp4`)
                            .duration(5)

                            .complexFilter(
                                [
                                    "[1:v]colorkey=0x00ff00:0.1:0.1[ckout]",
                                    "[0:v][ckout]overlay=x='if(gte(t,0), -w+(t)*400, 3)':y=(H-h)/2",

                                ])
                            .output(`Final/${nome}.out.mp4`)
                            .on("end", () => {

                                removeDir(`tmp/${cartella}`, () => { console.log(`Files di tmp/${cartella} rimossi`) })

                                setTimeout(() => {
                                    unlink(`Final/${nome}.out.mp4`).then(() => {
                                        console.log(`file: Final/${nome}.out.mp4 rimosso asgara`)
                                    })
                                }, 3000)








                                resolve(`Final/${nome}.out.mp4`)
                            })
                            .on("error", (e) => { reject(e) })
                            .run();





                    }).run()










            }).run()


    });







}


async function generaImmagini(testo, nome) {

    let nomeCartella = uuid()

    cartelle.push({ cartella: nomeCartella, data: Date(), nome });

    mkdir("tmp/" + nomeCartella)

    let t = testo.split("");
    let promises = []

    let letterePrec = "";
    for (let i = 0; i < t.length; i++) {
        let lettera = t[i];
        letterePrec += lettera;
        let n = aggiungi0(i);
        let p = convertiImmagine(["Assets/Images/green.png", "-gravity", "Center", "-pointsize", "30", "-font", "Assets/font.ttf", "-fill", "white", "-pointsize", "90", "-annotate", "0", `${letterePrec}`, `tmp/${nomeCartella}/img-${n}.png`])
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

module.exports = { convertVideo }