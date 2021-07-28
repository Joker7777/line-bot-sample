const express = require('express');
const app = express();
const webhookRouter = require('./bot/router');
const { config } = require('./config');

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.get("/", (req, res) => {
    res.sendStatus(200)
})

app.use('/webhook', webhookRouter)

app.listen(config.PORT, () => {
    console.log(config)
    console.log(`Example app listening at http://localhost:${config.PORT}`)
})
