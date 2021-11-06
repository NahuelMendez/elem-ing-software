class Order {

    constructor({ consumer, pizzeria, lineItems }) {
        this.consumer = consumer
        this.pizzeria = pizzeria
        this.lineItems = lineItems
    }

    getPizzeriaName() {
        return this.pizzeria.getName()
    }

    getConsumerName() {
        return this.consumer.getName()
    }

    getConsumerTelephone() {
        return this.consumer.getTelephone()
    }

    getConsumerEmail() {
        return this.consumer.getEmail()
    }

    wasMadeBy(consumerName) {
        return this.consumer.isNamed(consumerName)
    }

    wasMadeTo(pizzeriaName) {
        return this.pizzeria.isNamed(pizzeriaName)
    }

    hasLineItems(lineItems) {
        return this.lineItems == lineItems
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

    getProductPriceWithName(productName) {
        return this.pizzeria.getProductPriceWithName(productName)
    }

    calculatePrices(lineItem) {
        return this.getProductPriceWithName(lineItem.productName) * lineItem.quantity
    }

}

module.exports = { Order }