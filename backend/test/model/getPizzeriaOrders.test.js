const { createServices } = require('../../src/model/serviceFactory')
const testObjects = require('../testObjects')
const productFactory = require('../helpers/productFactory')

const { bancheroRegistrationData, guerrinRegistrationData } = testObjects.pizzeriasRegistrationData
const { kentRegistrationData } = testObjects.consumersRegistrationData

describe('find pizzeria orders', () => {
    let userService
    let menuService
    let orderService

    let pepperoniPizza

    let registeredPizzeria
    let registeredConsumer

    beforeEach(async () => {
        const services = createServices()
        userService = services.userService
        menuService = services.menuService
        orderService = services.orderService

        pepperoniPizza = productFactory.createPepperoniPizza()

        registeredPizzeria = await userService.registerPizzeria(bancheroRegistrationData)
        registeredPizzeriaWithoutProducts = await userService.registerPizzeria(guerrinRegistrationData)

        await menuService.addToMenuOf(bancheroRegistrationData.name, pepperoniPizza)

        registeredConsumer = await userService.registerConsumer(kentRegistrationData)

        const lineItems = [{ productName: pepperoniPizza.getName(), quantity: 1 }]
        
        const orderData = {
            consumerName: registeredConsumer.getName(),
            pizzeriaName: registeredPizzeria.getName(),
            lineItems
        }

        await orderService.placeOrder(orderData)
    })

    it('No order was found in the pizzeria when no order was made in that pizzeria', async () => {
        const foundOrders = await orderService.findOrdersByPizzeriaName(registeredPizzeriaWithoutProducts.getName())

        expect(foundOrders).toHaveLength(0)
    })

    it('can find the orders placed from a pizzeria when the pizzeria received an order', async () => {
        const foundOrders = await orderService.findOrdersByPizzeriaName(registeredPizzeria.getName())

        expect(foundOrders).toHaveLength(1)
    })

    it("cannot find orders when entering a consumer's name", async () => {
        const foundOrders = await orderService.findOrdersByPizzeriaName(registeredConsumer.getName())

        expect(foundOrders).toHaveLength(0)
    })

})