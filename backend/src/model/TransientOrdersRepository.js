require('../javascript-collections-extensions')

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
                            product: order.getPizzeria().getProductsInMenu().find(product => product.isNamed(productName)), // TODO: estoy rompiendo el encapsulamiento como un animal. Corregir cuando este arreglado lo de Order
                            totalSellsQuantity: quantity
                        })
                    )
            )

            .groupBy(element => element.pizzeria)
            .map((pizzeria, valuesGroupedByPizzeria) =>
                valuesGroupedByPizzeria
                    .groupBy(value => value.product)
                    .map((product, valuesGroupedByProduct) => ({
                        pizzeria,
                        product,
                        totalSellsQuantity: valuesGroupedByProduct.sum(value => value.totalSellsQuantity)
                    }))
                    .valuesAsArray()
            )
            .valuesAsArray()
            .flat()

            .sort((aProductSells, anotherProductSells) => {
                const sellsQuantityComparationResult = anotherProductSells.totalSellsQuantity - aProductSells.totalSellsQuantity

                return sellsQuantityComparationResult !== 0
                    ? sellsQuantityComparationResult
                    : aProductSells.pizzeria.getName() > anotherProductSells.pizzeria.getName() ? 1 : -1
            })
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