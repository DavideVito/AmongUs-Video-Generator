const express = require("express");
const { convertVideo } = require("./ConvertiVideo");
const uuid = require("uuid").v4
const { readFile } = require("fs").promises

const rateLimit = require("express-rate-limit");




const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 1 minute
    max: 20
});

const app = express();

app.use(express.static("public"))
app.use("/video", apiLimiter);




let port = process.env.PORT || 3000;

app.get("/video", apiLimiter, async (req, res) => {

    let testo = req.query.testo;
    let colore = req.query.colore;
    console.log({ testo, colore, ip: req.connection.remoteAddress })
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
        console.time(`Tempo impiegato per eseguire ${nome}: `)
        await convertVideo(nome, testo, colore);
        console.timeEnd(`Tempo impiegato per eseguire ${nome}: `)
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

