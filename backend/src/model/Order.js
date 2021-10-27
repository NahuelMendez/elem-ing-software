class Order {

    constructor({ consumer, pizzeria, lineItems }) {
        this.consumer = consumer
        this.pizzeria = pizzeria
        this.lineItems = lineItems
    }

    getPizzeriaName() {
        return this.pizzeria.getName()
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