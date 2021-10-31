const { UserService } = require('./UserService')
const { MenuService } = require("./MenuService")
const { OrderService } = require("../../src/model/OrderService")

const { TransientUsersRepository } = require("./TransientUsersRepository")
const { TransientOrdersRepository } = require("./TransientOrdersRepository")

const { MongoDBUsersRepository } = require("./repositories/MongoDBUsersRepository")
const { afterTestCleaning } = require('./repositories/mongoose')

function createServices() {
    const usersRepository = new MongoDBUsersRepository()
    const ordersRepository = new TransientOrdersRepository()

    return {
        userService: new UserService(usersRepository),
        menuService: new MenuService(usersRepository),
        orderService: new OrderService(usersRepository, ordersRepository)
    }
}

module.exports = { createServices, afterTestCleaning }