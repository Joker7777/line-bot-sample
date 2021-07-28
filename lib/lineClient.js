const { lineConf } = require('../config')
const line = require('@line/bot-sdk');

module.exports = class LineClient {
    constructor() {
        this.client = new line.Client({
            channelAccessToken: lineConf.LINE_CHANNEL_ACCESS_TOKEN
        });
    }

    replyMessage(replyToken, messages) {
        this.client.replyMessage(replyToken, messages)
            .then(() => {
                console.log('message was sent!')
            })
            .catch((err) => {
                console.log(('ERROR: ', err))
            })
    }

    pushMessage(userId, messages) {
        this.client.pushMessage(userId, messages)
            .then(() => {
                console.log('message was sent!')
            })
            .catch((err) => {
                console.log(('ERROR: ', err))
            })
    }
}