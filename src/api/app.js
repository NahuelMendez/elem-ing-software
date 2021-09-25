const express = require('express')
const bodyParser = require('body-parser')
const {registerPath} = require("./path")
const {pizzeriaSchema} = require("./schemas")
const {UserService} = require("../model/UserService");
const {TransientUsersRepository} = require("../model/TransientUsersRepository");

const usersService = new UserService(new TransientUsersRepository())
const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.post(registerPath, (request, response) => {
    const pizzeria = request.body

    pizzeriaSchema.validateAsync(pizzeria)
        .then(
            () => registerPizzeria(pizzeria, response)
        )
        .catch (
            error => {return response.status(400).json({error: error.message})}
        )
    
})

const registerPizzeria = (pizzeria, response) => {
    usersService.registerPizzeria(pizzeria)
        .then(
            userData => response.status(201).json({ name: userData.name })
        )
        .catch(
            error => response.status(400).json({ error: error.message })
        );
}

module.exports = {app}


