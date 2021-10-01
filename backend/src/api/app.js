const express = require('express')
var cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const {registerPath, loginPath, menuCreatePath} = require("./path")
const {UserService} = require("../model/UserService");
const {MenuService} = require("../model/MenuService");
const {TransientUsersRepository} = require("../model/TransientUsersRepository");
const {Product} = require('../model/Product')

const {
    registerPizzeriaRequestValidation,
    loginRequestValidation,
    productRequestValidation
} = require('./requestValidations')

const createApp = () => {

    const usersRepository = new TransientUsersRepository()
    const usersService = new UserService(usersRepository)
    const menuService = new MenuService(usersRepository)
    const app = express()

    app.use(cors())
    app.use(express.static(path.join(__dirname, '../../app/build')))

    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())

    app.post(registerPath, registerPizzeriaRequestValidation, (request, response) => {
        const pizzeria = request.body

        usersService.registerPizzeria(pizzeria)
            .then(user => response.status(201).json({name: user.getName()}))
            .catch(error => response.status(400).json({error: error.message}))
    })

    app.post(loginPath, loginRequestValidation, (request, response) => {
        const loginData = request.body

        usersService.login(loginData)
            .then(() => response.status(201).json({username: loginData.username}))
            .catch(error => response.status(404).json({error: error.message}))
    })
    
    app.put(menuCreatePath, productRequestValidation, (request, response) => {
        const productData = request.body
        const {pizzeriaName} = request.params

        const product = new Product(productData)

        menuService.addToMenuOf(pizzeriaName, product)
            .then(() => response.status(201).json(productData))
            .catch(error => response.status(400).json({error: error.message}))
    })

    return app
}


module.exports = {createApp}

