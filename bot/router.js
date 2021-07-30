const router = require('express').Router();
const ByMessage = require('../lib/byMessage');
const ByPostBack = require('../lib/byPostBack');

// userのファイルにtodo登録
router.post("/", (req, res) => {
    res.send("HTTP POST request sent the webhook URL!");
    const events = req.body.events[0];
    console.log(events);
    const userId = events.source.userId;
    if (typeof userId !== 'string') {
        // userじゃなかったら知らない
        console.log('ERROR: userId is undefined in events.source');
        return;
    }

    const replyToken = req.body.events[0].replyToken;

    switch (events.type) {
        case "message":
            ByMessage.exec(replyToken, userId, events.message);
            break;
        case "postback":
            ByPostBack.exec(replyToken, userId, events.postback);
            break;
        default:
            console.log(events);
    }
});

module.exports = router;