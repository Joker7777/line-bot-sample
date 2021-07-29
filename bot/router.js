const router = require('express').Router();
const remindsIO = require('../lib/remindsIO')
const lineClient = require('../lib/lineClient');

// userのファイルにtodo登録
router.post("/", (req, res) => {
    res.send("HTTP POST request sent the webhook URL!")
    if (req.body.events[0].type !== "message") {
        return
    }
    // userじゃなかったら知らない
    const userId = req.body.events[0].source.userId
    if (typeof userId !== 'string') {
        console.log('ERROR: userId is undefined in events.source');
        return
    }

    // userメッセージパース
    const message = req.body.events[0].message.text.split(' ');
    if (message.length == 2) {
        // add remind
        const data = {
            title: message[0],
            remindTime: message[1]
        }

        // userファイル書き込み
        try {
            remindsIO.addRemind(userId, data);
        } catch (err) {
            console.log(`ERROR: Cannot write file: ${userId}.json`);
            console.log(err);
            const reply = {
                type: 'text',
                text: `ごめんね、${message[0]} を登録できなかったよ`
            }
            lineClient.replyMessage(req.body.events[0].replyToken, reply)
            return
        }

        const reply = {
            type: 'text',
            text: `了解！ ${message[0]} を ${message[1]} にリマインドするね`
        };

        lineClient.replyMessage(req.body.events[0].replyToken, reply)
    } else if (message[0] === 'リスト') {
        // get reminds list
        let reminds;
        try {
            reminds = remindsIO.getReminds(userId);
        } catch {
            console.log(`ERROR: Cannot read file: ${userId}.json`);
            console.log(err);
            const reply = {
                type: 'text',
                text: `ごめんね、リストを取得できなかったよ`
            }
            lineClient.replyMessage(req.body.events[0].replyToken, reply)
            return
        }

        let remindListString = '';
        reminds.forEach(remind => {
            remindListString += `${remind.title} => ${remind.remindTime}\n`;
        });

        const reply = [
            {
                type: 'text',
                text: 'これが今登録されてるリマインダだよ'
            },
            {
                type: 'text',
                text: remindListString
            }
        ];

        lineClient.replyMessage(req.body.events[0].replyToken, reply)
    } else {
        console.log('WARN: user input was invalid. ', message);
        const messages = [
            {
                type: "text",
                text: "書式が違うよ。次のメッセージを参考にしてね",
            },
            {
                type: "text",
                text: "やりたいこと リマインド時間",
            }
        ];

        // validation error response
        lineClient.replyMessage(req.body.events[0].replyToken, messages)
        return
    }
});

module.exports = router;