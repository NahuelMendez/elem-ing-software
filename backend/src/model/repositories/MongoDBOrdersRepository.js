require('../../javascript-collections-extensions')

class MongoDBOrdersRepository {

    constructor(connection) {
        this.connection = connection
    }

    async orders() {
        return await this.connection.OrderModel.find({})
    }

    async pizzasBestsellers({ limit }) {
        return (await this.orders())
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
            .valuesAsArray()
            .flatMap(valuesGroupedByPizzeria =>
                valuesGroupedByPizzeria
                    .groupBy(value => value.product)
                    .valuesAsArray()
                    .map(valuesGroupedByProduct => ({
                        pizzeria: valuesGroupedByProduct[0].pizzeria,
                        product: valuesGroupedByProduct[0].product,
                        totalSellsQuantity: valuesGroupedByProduct.sum(value => value.totalSellsQuantity)
                    }))
            )

            .sort((aProductSells, anotherProductSells) => {
                const sellsQuantityComparationResult = anotherProductSells.totalSellsQuantity - aProductSells.totalSellsQuantity

                return sellsQuantityComparationResult !== 0
                    ? sellsQuantityComparationResult
                    : aProductSells.pizzeria.getName() > anotherProductSells.pizzeria.getName() ? 1 : -1
            })
            .slice(0, limit)
    }

    async findOrdersByConsumerName(consumerName) {
        return (await this.orders()).filter (order => order.wasMadeBy(consumerName))
    }

    async findOrdersByPizzeriaName(consumerName) {
        return (await this.orders()) // TODO: Ojo. Esta hardcodeado
    }

    async save(newOrder) {
        const createdOrder = new this.connection.OrderModel(newOrder)
        return await createdOrder.save()
    }



}

module.exports = { MongoDBOrdersRepository }