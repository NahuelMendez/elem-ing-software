const jwt = require('jsonwebtoken')
const express = require('express')
var cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const {registerPath, loginPath, menuPath, pizzeriaPath, consumerPath, searchPizzeriaPath, updateProductPath, createOrderPath} = require("./path")
const {UserService} = require("../model/UserService");
const {MenuService} = require("../model/MenuService");
const {OrderService} = require("../model/OrderService");
const {TransientUsersRepository} = require("../model/TransientUsersRepository");
const {TransientOrdersRepository} = require("../model/TransientOrdersRepository");
const {Product} = require('../model/Product')
const {OK, CREATED, BAD_REQUEST, NOT_FOUND} = require("./statusCode")
const {authenticatePizzeria, authenticateConsumer} = require("./authenticate")

const {
    registerPizzeriaRequestValidation,
    loginRequestValidation,
    productRequestValidation,
    orderRequestValidation
} = require('./requestValidations')

const createApp = () => {

    const usersRepository = new TransientUsersRepository()
    const ordersRepository = new TransientOrdersRepository()
    const usersService = new UserService(usersRepository)
    const menuService = new MenuService(usersRepository)
    const orderService = new OrderService(usersRepository, ordersRepository)
    const app = express()

    app.use(cors({ exposedHeaders: 'Authorization' }))
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
            .then(user => 
                response
                .header("Authorization", jwt.sign({username: user.getName(), email: user.getEmail(), role: user.getRoleName()}, 'secret'))
                .status(OK).json({
                    email: user.getEmail(), 
                    username: user.getName(), 
                    rol: user.getRoleName()
                }))
            .catch(error => response.status(NOT_FOUND).json({error: error.message}))
    })
    
    app.put(menuPath, productRequestValidation, authenticatePizzeria, (request, response) => {
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

    app.get(pizzeriaPath, (request, response) => {
        const {pizzeriaName} = request.params

        usersService.findPizzeriaByName(pizzeriaName)
            .then( pizzeria => response.status(OK).json({
                username: pizzeria.name,
                telephone: pizzeria.telephone,
                email: pizzeria.email
            }))
            .catch( error => response.status(NOT_FOUND).json({error : error.message}) )
    })

    app.get(consumerPath, (request, response) => {
        const {consumerName} = request.params

        usersService.findConsumerByName(consumerName)
            .then(consumer => response.status(OK).json({
                username: consumer.getName(),
                telephone: consumer.getTelephone(),
                email: consumer.getEmail()
            }))
            .catch( error => response.status(NOT_FOUND).json({error : error.message}) )
    })

    app.get(searchPizzeriaPath, (request, response) => {
        const {name} = request.query
        
        usersService.findPizzeriasByPartialName(name)
            .then(pizzeriasToJson)
            .then( pizzerias => response.status(OK).json(pizzerias))
    })
        
    app.delete(menuPath + '/:productName', (request, response) => {
        const {pizzeriaName, productName} = request.params

        menuService.removeProduct(pizzeriaName, productName)
            .then(() => response.status(OK).json({removed: productName}))
            .catch(error => response.status(NOT_FOUND).json({error : error.message}))
    })
    
    app.put(updateProductPath, productRequestValidation, authenticatePizzeria, (request, response) => {
        const {pizzeriaName, productName} = request.params
        const productData = request.body

        const product = new Product(productData)

        const dataToUpdate = { 
            pizzeriaName: pizzeriaName, 
            nameOfProductToUpdate: productName, 
            referenceProduct: product 
        }

        menuService.updateProduct(dataToUpdate)
            .then(() => response.status(OK).json({message: "The product was updated successfully"}))
            .catch( error => response.status(BAD_REQUEST).json({error: error.message}))
    })

    app.get('/api/consumer', authenticateConsumer, (request, response) => {
        const { user } = request
        console.log(user)

        usersService.findConsumerByName(user.username)
            .then(consumer => response.status(OK).json({
                username: consumer.getName(),
                telephone: consumer.getTelephone(),
                email: consumer.getEmail()
            }))
    })

    app.post(createOrderPath, orderRequestValidation, authenticateConsumer, (request, response) => {
        const { user } = request
        const {pizzeriaName, order} = request.body
        
        orderService.placeOrder({consumerName: user.username, pizzeriaName: pizzeriaName ,lineItems: order})
            .then(() => response.status(OK).json({message: "the order was confirmed"}))
            .catch((error) => response.status(BAD_REQUEST).json({error: error.message}))
    })

    const menuToJson = (menu) => {
        return menu.map (product => ({
                name: product.getName(),
                description: product.getDescription(),
                price: product.getPrice(),
                imageURL: product.getImageURL()}))
    }

    const pizzeriasToJson = (pizzerias) => {
        return pizzerias.map (pizzeria => ({name: pizzeria.getName()}))
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

