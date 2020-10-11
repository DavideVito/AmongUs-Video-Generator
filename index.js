const express = require("express");
const { convertVideo } = require("./ConvertiVideo");
const uuid = require("uuid").v4
const { readFile } = require("fs").promises


const app = express();

app.use(express.static("public"))


let port = process.env.PORT || 3000;

app.get("/video", async (req, res) => {

    let testo = req.query.testo;
    let colore = req.query.colore;

    if (testo.length > 15) {
        res.status(400).send("Text must be less than 15 characters")
        return;
    }

    if (testo.length === 0) {
        res.status(400).send("Where's the text?")
        return;
    }

    let nome = uuid();
    try {
        console.time("ciao")
        await convertVideo(nome, testo, colore);
        console.timeEnd("ciao")
    } catch (error) {
        console.log(error)
        res.status(400).send("The color u selected doesn't even exists for the god sake")
        return;
    }
    let file = await readFile(`Final/${nome}.out.mp4`)
    res.setHeader('Content-Disposition', `attachment;filename=${nome}.mp4`);
    res.setHeader("Content-Type", "video/mp4");
    res.send(file);
})




app.listen(port, () => { console.log(`http://localhost:${port}`) })

