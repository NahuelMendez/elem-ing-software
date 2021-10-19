const { Order } = require('./Order')
const {ModelException} = require("./ModelException");

class OrderService {

    constructor(usersRepository) {
        this.usersRepository = usersRepository
        this.orders = []
    }

    async findOrdersByConsumerName(consumerName) {
        return this.orders
    }

    async findOrdersByPizzeriaName(pizzeriaName) {
        return this.orders
    }

    async placeOrder({ consumerName, pizzeriaName, lineItems }) {
        this.assertHasSomeProducts(lineItems)

        const consumer = await this.usersRepository.findConsumerByName(consumerName)
        const pizzeria = await this.usersRepository.findPizzeriaByName(pizzeriaName)

        this.orders = [new Order({ consumer, pizzeria, lineItems })]
    }

    assertHasSomeProducts(lineItems) {
        if (lineItems.length === 0)
            throw new ModelException('Cannot place an order with no products')
    }
}

module.exports = { OrderService }