const express = require("express");
const { convertVideo } = require("./ConvertiVideo");
const uuid = require("uuid").v4
const { readFile } = require("fs").promises

const app = express();

app.use(express.static("public"))


let port = process.env.PORT || 3000;

app.get("/video", async (req, res) => {

    let testo = req.query.testo;
    let nome = uuid();
    await convertVideo(nome, testo);
    let file = await readFile(`Final/${nome}.out.mp4`)
    res.setHeader('Content-Disposition', `attachment;filename=${nome}.mp4`);
    res.setHeader("Content-Type", "video/mp4");
    res.send(file);
})




app.listen(port, () => { console.log(`http://localhost:${port}`) })

