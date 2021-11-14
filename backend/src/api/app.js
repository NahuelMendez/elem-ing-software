const jwt = require('jsonwebtoken')
const express = require('express')
var cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const { createServices } = require('../../src/model/serviceFactory')
const {Product} = require('../model/Product')

const {
    registerPath, 
    loginPath, 
    menuPath, 
    pizzeriaPath, 
    searchPizzeriaPath, 
    updateProductPath, 
    orderPath,
    consumerPath,
    rankingPath,
    pizzeriaOrdersPath
} = require("./path")

const {OK, CREATED, BAD_REQUEST, NOT_FOUND} = require("./statusCode")
const {authenticatePizzeria, authenticateConsumer} = require("./authenticate")

const {
    registerPizzeriaRequestValidation,
    loginRequestValidation,
    productRequestValidation,
    orderRequestValidation,
    editConsumerDataRequestValidation
} = require('./requestValidations')

const createApp = () => {
    const services = createServices()
    const usersService = services.userService
    const menuService = services.menuService
    const orderService = services.orderService

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
                .header("Authorization", createToken(user))
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

    app.get(pizzeriaOrdersPath, authenticatePizzeria, (request, response) => {
        const { user } = request

        orderService.findOrdersByPizzeriaName(user.username)
            .then(convertToPizzeriaOrders)
            .then(orders => response.status(OK).json(orders))
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

    app.get(searchPizzeriaPath, (request, response) => {
        const {name, orderBy} = request.query

        findPizzeria(name, orderBy)
            .then(pizzeriasToJson)
            .then( pizzerias => response.status(OK).json(pizzerias))
    })

    function findPizzeria(name, orderBy) {
        switch (orderBy) {
            case 'MOST_CHEAP':
                return usersService.findPizzeriasByPartialNameSortedByMostCheap(name)
            default:
                return usersService.findPizzeriasByPartialName(name)
        }
    }
        
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

    app.get(consumerPath, authenticateConsumer, (request, response) => {
        const { user } = request

        usersService.findConsumerByName(user.username)
            .then(consumer => response.status(OK).json({
                username: consumer.getName(),
                telephone: consumer.getTelephone(),
                email: consumer.getEmail(),
                address: consumer.getAddress(),
                image: consumer.getImage()
            }))
    })

    app.post(orderPath, orderRequestValidation, authenticateConsumer, (request, response) => {
        const { user } = request
        const {pizzeriaName, order} = request.body

        orderService.placeOrder({consumerName: user.username, pizzeriaName: pizzeriaName ,lineItems: order})
            .then(() => response.status(CREATED).json({message: "the order was confirmed"}))
            .catch((error) => response.status(BAD_REQUEST).json({error: error.message}))
    })

    app.get(orderPath, authenticateConsumer, (request, response) => {
        const { user } = request

        orderService.findOrdersByConsumerName(user.username)
            .then (orders => convertToOrderHistory(orders))
            .then(orderHistory => response.status(OK).json(orderHistory))
    })

    

    app.get(rankingPath, (request, response) => {
        orderService.pizzasBestsellers({limit: 5})
            .then(bestsellers => response.status(OK).json(bestsellers))
    })

    app.put(consumerPath, editConsumerDataRequestValidation, authenticateConsumer, (request, response) => {
        const { user } = request
        const {name , telephone , email, address, image } = request.body
        
        usersService.editConsumerData(user.username ,name ,telephone ,email, address, image)
            .then(() => 
                response
                    .header("Authorization", jwt.sign({ username: name, email: email, address, role: user.role }, 'secret'))
                    .status(OK)
                    .json('the data was successfully modified'))
            .catch( error => response.status(BAD_REQUEST).json({error: error.message}))
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

    const register = ({name, telephone, email, address, password, rol}) => {
        const user = {name, telephone, email, address, password}
        
        if (rol === 'pizzeria') {
            return usersService.registerPizzeria(user)
        } else {
            return usersService.registerConsumer(user)
        }
    }

    const convertToOrderHistory = (orders) => {
        return orders.map(order => ({ pizzeriaName: order.getPizzeriaName(), total: order.getTotal() }))
    }

    const convertToPizzeriaOrders = (orders) => {
        return orders.map(order => ({
            orderNumber: orders.indexOf(order) + 1, 
            consumerName: order.getConsumerName(), 
            telephone: order.getConsumerTelephone(), 
            email: order.getConsumerEmail(), 
            total: order.getTotal(), 
            lineItems: convertToLineItems(order)}))
            .sort((firstOrder, secondOrder) => secondOrder.orderNumber - firstOrder.orderNumber)
    }

    const convertToLineItems = (order) => {
        return order.getLineItems().map(lineItem => ({
            productName: lineItem.productName,
            quantity: lineItem.quantity,
            price: order.getProductPriceWithName(lineItem.productName)
        }))
    } 

    const createToken = (user) => {
        return jwt.sign({ username: user.getName(), email: user.getEmail(), role: user.getRoleName() }, 'secret')
    }

    return app
}


module.exports = {createApp}



