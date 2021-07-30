const remindsIO = require('./remindsIO');
const lineClient = require('../lib/lineClient');

module.exports = class ByPostBack {
    static exec(replyToken, userId, postback) {
        console.log(postback);
        let reply;
        switch (postback.data) {
            case 'add':
            case 'delete':
                reply = {
                    type: 'text',
                    text: 'いつかやるね！'
                };
                lineClient.replyMessage(replyToken, reply);
                break;
            case 'list':
                // get reminds list
                let reminds;
                try {
                    reminds = remindsIO.getReminds(userId);
    
                    let remindListString = '';
                    reminds.forEach(remind => {
                        remindListString += `${remind.title} => ${remind.remindTime}\n`;
                    });
        
                    reply = [
                        {
                            type: 'text',
                            text: 'これが今登録されてるリマインダだよ'
                        },
                        {
                            type: 'text',
                            text: remindListString
                        }
                    ];
                } catch {
                    console.log(`ERROR: Cannot read file: ${userId}.json`);
                    console.log(err);
                    reply = {
                        type: 'text',
                        text: `ごめんね、リストを取得できなかったよ`
                    }
                }
    
                lineClient.replyMessage(replyToken, reply)
                break;
            case 'manage':
                // LIFF
                break;
            default:
                ;
        }
    }
}
