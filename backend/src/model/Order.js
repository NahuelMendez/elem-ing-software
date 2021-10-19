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

    getLineItems() {
        return this.lineItems
    }

}

module.exports = { Order }