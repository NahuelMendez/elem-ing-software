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
        const userData = request.body

        register(userData)
            .then(user => response.status(CREATED).json({name: user.getName(), rol: user.getRoleName()}))
            .catch(error => response.status(BAD_REQUEST).json({error: error.message}))
    })

    app.post(loginPath, loginRequestValidation, (request, response) => {
        const loginData = request.body

        usersService.login(loginData)
            .then(user => response.status(OK).json({email: user.getEmail(), rol: user.getRoleName()}))
            .catch(error => response.status(NOT_FOUND).json({error: error.message}))
    })
    
    app.put(menuPath, productRequestValidation, (request, response) => {
        const productData = request.body
        const {pizzeriaName} = request.params

        const product = new Product(productData)

        menuService.addToMenuOf(pizzeriaName, product)
            .then(() => response.status(OK).json(productData))
            .catch(error => response.status(BAD_REQUEST).json({error: error.message}))
    })

    app.get(menuPath, (request, response) => {
        const {pizzeriaName} = request.params

        menuService.productsInMenuOf(pizzeriaName)
            .then(menuToJson)
            .then( menu => response.status(OK).json(menu) )
            .catch( error => response.status(NOT_FOUND).json({error : error.message}) )
        
    })

    app.delete(menuPath, (request, response) => {
        const {pizzeriaName} = request.params
        const {productName} = request.body

        menuService.removeProduct(pizzeriaName, productName)
            .then(() => response.status(OK).json({removed: productName}))
            .catch(error => response.status(NOT_FOUND).json({error : error.message}))
    })

    const menuToJson = (menu) => {

        return menu.map (product => ({
                name: product.getName(),
                description: product.getDescription(),
                price: product.getPrice(),
                imageURL: product.getImageURL()}))
    }

    const register = ({name, telephone, email, password, rol}) => {
        const user = {name: name, telephone: telephone, email: email, password: password}
        
        if (rol === 'pizzeria') {
            return usersService.registerPizzeria(user)
        } else {
            return usersService.registerConsumer(user)
        }
    }

    return app
}


module.exports = {createApp}

