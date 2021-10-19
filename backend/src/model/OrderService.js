const { Order } = require('./Order')

class OrderService {

    async findOrdersByConsumerName(consumerName) {
        return this.orders
    }

    async placeOrder({ consumerName, pizzeriaName, lineItems }) {
        const consumer = null
        const pizzeria = null
        this.orders = [new Order({ consumer, pizzeria, lineItems })]
    }

}

module.exports = { OrderService }