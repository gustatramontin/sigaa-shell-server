const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const SigaaScrapping = require('./webscrapper')
const app = express()

const sigaa = new SigaaScrapping()

//app.use('/public', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'))
})

app.post('/api/getSigaa', async (req, res) => {
    console.log(req.body)

    if (req.body.username === "None" && req.body.password === "None")
        res.send("{}")

    const data = await sigaa.init(req.body.username, req.body.password)
    console.log(data)

    res.json(data)
})

app.listen(4000, () => {
    console.log("Express listening to port 4000");
})