const express = require('express')
const {CosoService} = require("../model/cosoService");

const app = express()

const cosoService = new CosoService()

app.get('/api/', (request, response) => {
    response.json({
        mensaje: cosoService.algo()
    })
})

module.exports = { app }
