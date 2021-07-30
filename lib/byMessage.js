const remindsIO = require('./remindsIO');
const lineClient = require('../lib/lineClient');

module.exports = class ByMessage {
    static exec(replyToken, userId, message) {
        // userメッセージパース
        const params = message.text.split(' ');
        if (params.length == 2) {
            // add remind
            const data = {
                title: params[0],
                remindTime: params[1]
            }

            // userファイル書き込み
            try {
                remindsIO.addRemind(userId, data);
            } catch (err) {
                console.log(`ERROR: Cannot write file: ${userId}.json`);
                console.log(err);
                const reply = {
                    type: 'text',
                    text: `ごめんね、${params[0]} を登録できなかったよ`
                }
                lineClient.replyMessage(replyToken, reply)
                return
            }

            const reply = {
                type: 'text',
                text: `了解！ ${params[0]} を ${params[1]} にリマインドするね`
            };

            lineClient.replyMessage(replyToken, reply)
        } else if (params[0] === 'リスト') {
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
                lineClient.replyMessage(replyToken, reply)
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

            lineClient.replyMessage(replyToken, reply)
        } else {
            console.log('WARN: user input was invalid. ', message);
            const reply = [
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
            lineClient.replyMessage(replyToken, reply)
            return
        }
    }
}