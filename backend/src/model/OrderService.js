const { Order } = require('./Order')

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
        const consumer = await this.usersRepository.findConsumerByName(consumerName)
        const pizzeria = null
        this.orders = [new Order({ consumer, pizzeria, lineItems })]
    }

}

module.exports = { OrderService }