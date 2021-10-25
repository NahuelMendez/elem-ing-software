class TransientOrdersRepository {

    constructor() {
        this.orders = []
    }

    async findOrdersByConsumerName(consumerName) {
        return this.orders
    }

    async findOrdersByPizzeriaName(consumerName) {
        return this.orders
    }

    async save(newOrder) {
        this.orders.push(newOrder)
        return newOrder
    }
    


}

module.exports = { TransientOrdersRepository }