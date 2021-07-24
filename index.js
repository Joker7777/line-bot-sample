const https = require("https")
const { config } = require("config")
const express = require("express")
const app = express()

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.get("/", (req, res) => {
    res.sendStatus(200)
})

app.post("/webhook", (req, res) => {
    res.send("HTTP POST request sent t the webhook URL!")
    if (req.body.events[0].type === "message") {
        const dataString = JSON.stringify({
            replyToken: req.body.events[0].replyToken,
            messages: [
                {
                    "type": "text",
                    "text": "Hello, user"                    
                },
                {
                    "type": "text",
                    "text": "May I help you?"
                }
            ]
        })

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${config.TOKEN}`
        }

        const webhookOptions = {
            "hostname": "api.line.me",
            "path": "/v2/bot/message/reply",
            "method": "POST",
            "headers": headers,
            "body": dataString
        }

        const request = https.request(webhookOptions, (res) => {
            res.on("data", (d) => {
                console.log(d)
            })
        })

        request.write(dataString)
        request.end()
    }
})

app.listen(config.PORT, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
