const { Order } = require('./Order')
const {ModelException} = require("./ModelException");

class OrderService {

    constructor(usersRepository, ordersRepository) {
        this.usersRepository = usersRepository
        this.ordersRepository = ordersRepository
    }

    async findOrdersByConsumerName(consumerName) {
        return this.ordersRepository.findOrdersByConsumerName(consumerName)
    }

    async findOrdersByPizzeriaName(pizzeriaName) {
        return this.ordersRepository.findOrdersByPizzeriaName(pizzeriaName)
    }

    async placeOrder({ consumerName, pizzeriaName, lineItems }) {
        this.assertHasSomeProducts(lineItems)
        this.assertHasValidQuantities(lineItems)

        const consumer = await this.usersRepository.findConsumerByName(consumerName)
        const pizzeria = await this.usersRepository.findPizzeriaByName(pizzeriaName)

        const newOrder = new Order({ consumer, pizzeria, lineItems })

        return this.ordersRepository.save(newOrder)
    }

    assertHasSomeProducts(lineItems) {
        if (lineItems.length === 0)
            throw new ModelException('Cannot place an order with no products')
    }

    assertHasValidQuantities(lineItems) {
        if (lineItems.some(lineItem => lineItem.quantity < 1))
            throw new ModelException('Line items quantity cannot be less than one')
    }
}

module.exports = { OrderService }