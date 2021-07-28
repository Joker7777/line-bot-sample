// const fs = require('fs');
const router = require('express').Router();
const lineClient = new require('../lib/lineClient');

// userのファイルにtodo登録
router.post("/", (req, res) => {
    res.send("HTTP POST request sent the webhook URL!")
    if (req.body.events[0].type === "message") {
        // userじゃなかったら知らない
        const userId = req.body.events[0].source.userId
        if (typeof userId !== 'string') {
            console.log('ERROR: userId is undefined in events.source');
            return
        }

        // userメッセージパース
        const message = req.body.events[0].message.text.split(' ');
        if (message.length !== 2) {
            console.log('WARN: user input was invalid. ', message);
        }

            const messages = [
                {
                    type: "text",
                    text: "書式が違うよ。次のメッセージを参考にしてね。",
                },
                {
                    type: "text",
                    text: "やりたいこと リマインド時間",
                }
            ];
            // validation error response
            lineClient.replyMessage(req.body.events[0].replyToken, messages)

        const data = {
            title: message[0],
            remindTime: message[1]
        }

        // userファイル書き込み
        // できないのでdbかな。。
        // try {
        //     fs.writeFileSync(userId + '.txt', JSON.stringify(data));
        // } catch (err) {
        //     console.log(`ERROR: Cannot write file: ${userId}.txt`);
        //     return
        // }

        const reply = {
            type: 'text',
            text: `了解！ ${message[0]} を ${message[1]} にリマインドするね。`
        };

        // reply message
        lineClient.replyMessage(req.body.events[0].replyToken, reply)
    }
});

module.exports = router;