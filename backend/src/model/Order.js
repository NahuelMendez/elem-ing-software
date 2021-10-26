class Order {

    constructor({ consumer, pizzeria, lineItems }) {
        this.consumer = consumer
        this.pizzeria = pizzeria
        this.lineItems = lineItems
    }

    wasMadeBy(aConsumer) {
        return true
    }

    wasMadeTo(aPizzeria) {
        return true
    }

    hasLineItems(lineItems) {
        return this.lineItems(lineItem => lineItems.includes(lineItem))
    }

    getPizzeria() {
        return this.pizzeria
    }

    getLineItems() {
        return this.lineItems
    }

}

module.exports = { Order }