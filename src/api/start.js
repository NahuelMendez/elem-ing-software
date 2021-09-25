const { createApp } = require('./app')

const port = process.env.PORT || 8080

createApp().listen(port)