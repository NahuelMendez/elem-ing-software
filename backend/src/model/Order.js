class Order {

    constructor({ consumer, pizzeria, lineItems }) {
        this.consumer = consumer
        this.pizzeria = pizzeria
        this.lineItems = lineItems
    }

    getPizzeriaName() {
        return this.pizzeria.getName()
    }

    wasMadeBy(consumerName) {
        return this.consumer.isNamed(consumerName)
    }

    wasMadeTo(aPizzeria) {
        return true
    }

    hasLineItems(expectedLineItems) {
        return this.lineItems.every(lineItem =>
            expectedLineItems.some(expectedLineItem =>
                expectedLineItem.productName== lineItem.productName &&
                expectedLineItem.quantity == lineItem.quantity
            )
        )
    }

    getPizzeria() {
        return this.pizzeria
    }

    getLineItems() {
        return this.lineItems
    }

    getTotal() {
        const prices = this.lineItems.map ( lineItem => this.calculatePrices(lineItem))
        
        return prices.reduce ((previousValue, price) => previousValue + price, 0)
    }

    calculatePrices(lineItem) {
        return this.pizzeria.getProductPriceWithName( lineItem.productName) * lineItem.quantity
    }

}

module.exports = { Order }