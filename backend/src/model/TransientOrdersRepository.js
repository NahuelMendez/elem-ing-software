class TransientOrdersRepository {

    constructor() {
        this.orders = []
    }

    async pizzasBestsellers({ limit }) {
        const quantityMap = this.orders
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
            .reduce(
                (quantityMap, { pizzeria, product, totalSellsQuantity }) => {
                    const key = product.getName()

                    const acumulatedQuantity = quantityMap.has(key) ? quantityMap.get(key).totalSellsQuantity : 0

                    quantityMap.set(key, {
                        pizzeria,
                        product,
                        totalSellsQuantity: totalSellsQuantity + acumulatedQuantity
                    })
                    return quantityMap
                },
                new Map())

        return Array
                .from(quantityMap.values())
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