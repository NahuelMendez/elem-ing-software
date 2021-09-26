const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const {registerPath} = require("./path")
const {pizzeriaSchema} = require("./schemas")
const {UserService} = require("../model/UserService");
const {TransientUsersRepository} = require("../model/TransientUsersRepository");

const createApp = () => {

    const usersService = new UserService(new TransientUsersRepository())
    const app = express()

    app.use(express.static(path.join(__dirname, '../../app/build')))

    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())

    app.post(registerPath, (request, response) => {
        const pizzeria = request.body

        pizzeriaSchema.validateAsync(pizzeria)
            .then(
                () => registerPizzeria(pizzeria, response)
            )
            .catch (
                error => response.status(400).json({error: error.message})
            )
    })

    const registerPizzeria = (pizzeria, response) => {
        usersService.registerPizzeria(pizzeria)
            .then(
                user => response.status(201).json({ name: user.getName() })
            )
            .catch(
                error => response.status(400).json({ error: error.message })
            );
    }

    return app
}



module.exports = {createApp}


