const { UserService } = require('./UserService')
const { MenuService } = require("./MenuService")
const { OrderService } = require("../../src/model/OrderService")
const { TransientUsersRepository } = require("./TransientUsersRepository")
const { TransientOrdersRepository } = require("./TransientOrdersRepository")

function createServices() {
    const usersRepository = new TransientUsersRepository()
    const ordersRepository = new TransientOrdersRepository()

    return {
        userService: new UserService(usersRepository),
        menuService: new MenuService(usersRepository),
        orderService: new OrderService(usersRepository, ordersRepository)
    }
}

module.exports = { createServices }