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


// --------------------
// const message = {
//     type: 'text',
//     text: 'Hello World'
// };

// // push message
// // 一度送信してくれたことのある人にしか送れない
// client.pushMessage('', message)
//     .then(() => {
//         console.log('message was sent!');
//     })
//     .catch((err) => {
//         console.log('ERROR: ', err);
//     })