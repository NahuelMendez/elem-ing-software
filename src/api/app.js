const express = require('express')
const bodyParser = require('body-parser')
const {registerPath, menuCreatePath} = require("./path")
const {pizzeriaSchema, productsSchema} = require("./schemas")
const {UserService} = require("../model/UserService");
const {MenuService} = require("../model/MenuService");
const {TransientUsersRepository} = require("../model/TransientUsersRepository");
const {Product} = require('../model/Product')

const createApp = () => {

    const usersRepository = new TransientUsersRepository()
    const usersService = new UserService(usersRepository)
    const menuService = new MenuService(usersRepository)
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
                error => response.status(400).json({error: error.message})
            )
    })

    app.put(menuCreatePath, (request, response) => {
        const {menu} = request.body
        const {pizzeriaName} = request.params

        productsSchema.validateAsync(menu)
            .then(
                () => createMenu(menuService, pizzeriaName, menu, response)
            )
            .catch(
                error => response.status(400).json({error : error.message}) 
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

    function createMenu(menuService, pizzeriaName, menu, response) {
        const products = menu.map ( product => new Product(product) )

        menuService.createMenu(pizzeriaName, products)
            .then(
                () => response.status(201).json({ message: 'successful operation' })
            )
            .catch(
                error => response.status(400).json({ error: error.message })
            );
    }

    return app
}


module.exports = {createApp}






