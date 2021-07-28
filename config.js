exports.config = {
    PORT: process.env.PORT || 3000,
}

exports.lineConf = {
    LINE_CHANNEL_ACCESS_TOKEN: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    LINE_CHANNEL_SECRET: process.env.LINE_CHANNEL_SECRET
}

exports.mySqlConf = {
    DB_URL: process.env.CLEARDB_DATABASE_URL
}
