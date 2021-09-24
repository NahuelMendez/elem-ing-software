const express = require('express')
const bodyParser = require('body-parser')
const {registerPath} = require("./path")
const {UserService} = require("../model/UserService");
const {TransientUsersRepository} = require("../model/TransientUsersRepository");

const usersService = new UserService(new TransientUsersRepository())
const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.post(registerPath, async (request, response) => {
    const pizzeria = request.body

    usersService.registerPizzeria(pizzeria)
        .then( userData => response.status(201).json({
             name: userData.name
        }))
        .catch(
        error => response.status(404).json({error: error.message})
        )
})



module.exports = {app}
