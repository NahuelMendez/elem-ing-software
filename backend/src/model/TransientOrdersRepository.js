class TransientOrdersRepository {

    constructor() {
        this.orders = []
    }

    async pizzasBestsellers({ limit }) {
        const productsQuantitiesByPizzerias = this.orders
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
                (productsQuantitiesByPizzerias, { pizzeria, product, totalSellsQuantity }) => {
                    const pizzeriaKey = pizzeria.getName()
                    const productKey = product.getName()

                    const pizzeriaProductQuantities = productsQuantitiesByPizzerias.get(pizzeriaKey) || new Map()

                    const acumulatedQuantity = pizzeriaProductQuantities.has(productKey) ? pizzeriaProductQuantities.get(productKey).totalSellsQuantity : 0

                    pizzeriaProductQuantities.set(productKey, {
                        pizzeria,
                        product,
                        totalSellsQuantity: totalSellsQuantity + acumulatedQuantity
                    })

                    productsQuantitiesByPizzerias.set(pizzeriaKey, pizzeriaProductQuantities)

                    return productsQuantitiesByPizzerias
                },
                new Map())

        return Array
                .from(productsQuantitiesByPizzerias.values())
                .flatMap(entry => Array.from(entry.values()))
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