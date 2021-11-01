const { UserService } = require('./UserService')
const { MenuService } = require("./MenuService")
const { OrderService } = require("../../src/model/OrderService")

const { TransientUsersRepository } = require("./TransientUsersRepository")
const { TransientOrdersRepository } = require("./TransientOrdersRepository")

const { MongoDBUsersRepository } = require("./repositories/MongoDBUsersRepository")
const { MongooseConnection, afterTestCleaning } = require('./repositories/mongoose')

const makeServiceTransactional = (service, transactionalMessageNames) => {
    const handler = {
        get: function(target, propertyName, receiver) {
            if (transactionalMessageNames.includes(propertyName))
                return async function() {
                    return target.runInTransaction(async () => await target[propertyName](...arguments))
                }
            else
                return target[propertyName]
        }
    }

    return new Proxy(service, handler)
}

function createServices() {
    const connection = new MongooseConnection()

    const usersRepository = new MongoDBUsersRepository(connection)
    const ordersRepository = new TransientOrdersRepository()

    const transactionalUserService = makeServiceTransactional(
        new UserService(connection, usersRepository),
        [
            'existsPizzeriaNamed',
            'existsUserWithEmail',
            'registerPizzeria',
            'registerConsumer',
            'login',
            'findConsumerByName',
            'findPizzeriaByName',
            'findPizzeriasByPartialName',
            'editConsumerData'
        ]
    )

    const transactionalMenuService = makeServiceTransactional(
        new MenuService(connection, usersRepository),
        [
            'productsInMenuOf',
            'addToMenuOf',
            'removeProduct',
            'updateProduct'
        ]
    )

    return {
        userService: transactionalUserService,
        menuService: transactionalMenuService,
        orderService: new OrderService(usersRepository, ordersRepository)
    }
}

module.exports = { createServices, afterTestCleaning }