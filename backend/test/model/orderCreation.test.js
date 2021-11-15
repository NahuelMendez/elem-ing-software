const { createServices } = require('../../src/model/serviceFactory')

const testObjects = require('../testObjects')
const productFactory = require('../helpers/productFactory')

const { bancheroRegistrationData } = testObjects.pizzeriasRegistrationData
const { kentRegistrationData } = testObjects.consumersRegistrationData

describe("Consumer order", () => {
    let userService
    let menuService
    let orderService

    let pepperoniPizza
    let meatPizza

    let registeredPizzeria
    let registeredConsumer

    beforeEach(async () => {
        const services = createServices()
        userService = services.userService
        menuService = services.menuService
        orderService = services.orderService

        pepperoniPizza = productFactory.createPepperoniPizza()
        meatPizza = productFactory.createMeatPizza()

        registeredPizzeria = await userService.registerPizzeria(bancheroRegistrationData)
        await menuService.addToMenuOf(bancheroRegistrationData.name, pepperoniPizza)
        await menuService.addToMenuOf(bancheroRegistrationData.name, meatPizza)

        registeredConsumer = await userService.registerConsumer(kentRegistrationData)
    })

    it("a registered consumer can place an order", async () => {
        const orderData = {
            consumerName: registeredConsumer.getName(),
            pizzeriaName: registeredPizzeria.getName(),
            lineItems: [{ product: pepperoniPizza, quantity: 1 }]
        }

        await orderService.placeOrder(orderData)

        const foundOrders = await orderService.findOrdersByConsumerName(registeredConsumer.getName())
        expect(foundOrders).toHaveLength(1)

        expectToContainOrderWith(
            { consumer: registeredConsumer,  pizzeria: registeredPizzeria, lineItems: orderData.lineItems },
            foundOrders
        )
    })

    it("a not registered consumer cannot place an order", async () => {
        const notRegisteredConsumerName = 'NOT REGISTERED CONSUMER NAME'

        const orderData = {
            consumerName: notRegisteredConsumerName,
            pizzeriaName: registeredPizzeria.getName(),
            lineItems: [{ product: pepperoniPizza, quantity: 1 }]
        }

        await expect(
            orderService.placeOrder(orderData)
        ).rejects.toThrow(`Consumer ${notRegisteredConsumerName} not found`)

        await expectPizzeriaHasNoOrders(orderService, registeredPizzeria.getName())
    })

    it("a registered consumer cannot place an order to a not registered pizzeria", async () => {
        const notRegisteredPizzeriaName = 'NOT REGISTERED PIZZERIA NAME'

        const orderData = {
            consumerName: registeredConsumer.getName(),
            pizzeriaName: notRegisteredPizzeriaName,
            lineItems: [{ product: pepperoniPizza, quantity: 1 }]
        }

        await expect(
            orderService.placeOrder(orderData)
        ).rejects.toThrow(`Pizzeria ${notRegisteredPizzeriaName} not found`)

        await expectConsumerHasNoOrders(orderService, registeredConsumer.getName())
    })

    it("a registered consumer cannot place an order with no products", async () => {
        const orderData = {
            consumerName: registeredConsumer.getName(),
            pizzeriaName: registeredPizzeria.getName(),
            lineItems: []
        }

        await expect(
            orderService.placeOrder(orderData)
        ).rejects.toThrow(`Cannot place an order with no products`)

        await expectConsumerHasNoOrders(orderService, registeredConsumer.getName())
        await expectPizzeriaHasNoOrders(orderService, registeredPizzeria.getName())
    })

    it("line items quantity cannot be less than one", async () => {
        const orderData = {
            consumerName: registeredConsumer.getName(),
            pizzeriaName: registeredPizzeria.getName(),
            lineItems: [{ product: pepperoniPizza, quantity: 0 }]
        }

        await expect(
            orderService.placeOrder(orderData)
        ).rejects.toThrow(`Line items quantity cannot be less than one`)

        await expectConsumerHasNoOrders(orderService, registeredConsumer.getName())
        await expectPizzeriaHasNoOrders(orderService, registeredPizzeria.getName())
    })

})

async function expectConsumerHasNoOrders(orderService, consumerName) {
    const foundOrders = await orderService.findOrdersByConsumerName(consumerName)
    expect(foundOrders).toHaveLength(0)
}

async function expectPizzeriaHasNoOrders(orderService, pizzeriaName) {
    const foundOrders = await orderService.findOrdersByPizzeriaName(pizzeriaName)
    expect(foundOrders).toHaveLength(0)
}

function expectToContainOrderWith({ consumer, pizzeria, lineItems }, actualOrders) {
    expect(
        actualOrders.some(order =>
            order.wasMadeBy(consumer.getName()) &&
            order.wasMadeTo(pizzeria.getName()) &&
            order.hasLineItems(lineItems)
        )
    ).toBe(true)
}