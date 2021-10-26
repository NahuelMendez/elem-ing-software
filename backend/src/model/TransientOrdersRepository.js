class TransientOrdersRepository {

    constructor() {
        this.orders = []
    }

    async pizzasBestsellers({ limit }) {
        return this.orders
            .flatMap(order =>
                order
                    .getLineItems()
                    .map(({productName, quantity}) =>
                        ({
                            pizzeria: order.getPizzeria(),
                            product: order.getPizzeria().getProductsInMenu().find(product => product.isNamed(productName)),
                            totalSellsQuantity: quantity
                        })
                    )
            )
            .sort((aProductSells, anotherProductSells) => anotherProductSells.totalSellsQuantity - aProductSells.totalSellsQuantity)
            .slice(0, limit)
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