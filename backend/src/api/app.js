const express = require('express')
var cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const {registerPath, loginPath, menuPath} = require("./path")
const {UserService} = require("../model/UserService");
const {MenuService} = require("../model/MenuService");
const {TransientUsersRepository} = require("../model/TransientUsersRepository");
const {Product} = require('../model/Product')
const {OK, CREATED, BAD_REQUEST, NOT_FOUND} = require("./statusCode")

const {
    registerPizzeriaRequestValidation,
    loginRequestValidation,
    productsRequestValidation
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
            .then(user => response.status(CREATED).json({name: user.getName()}))
            .catch(error => response.status(BAD_REQUEST).json({error: error.message}))
    })

    app.post(loginPath, loginRequestValidation, (request, response) => {
        const loginData = request.body

        usersService.login(loginData)
            .then(() => response.status(OK).json({username: loginData.username}))
            .catch(error => response.status(NOT_FOUND).json({error: error.message}))
    })
    
    app.put(menuPath, productsRequestValidation, (request, response) => {
        const {menu} = request.body
        const {pizzeriaName} = request.params

        const products = menu.map(product => new Product(product))

        menuService.createMenu(pizzeriaName, products)
            .then(() => response.status(CREATED).json({message: 'successful operation'}))
            .catch(error => response.status(BAD_REQUEST).json({error: error.message}))
    })

    app.get(menuPath, (request, response) => {
        const {pizzeriaName} = request.params

        menuService.productsInMenuOf(pizzeriaName)
            .then(menuToJson)
            .then( menu => response.status(OK).json(menu) )
            .catch( error => response.status(NOT_FOUND).json({error : error.message}) )
        
    })

    const menuToJson = (menu) => {

        return menu.map (product => ({
                name: product.getName(),
                description: product.getDescription(),
                price: product.getPrice(),
                imageURL: product.getImageURL()}))
    }

    return app
}


module.exports = {createApp}

