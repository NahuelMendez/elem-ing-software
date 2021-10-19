const { TransientUsersRepository } = require("../../src/model/TransientUsersRepository");
const { UserService } = require('../../src/model/UserService')
const { MenuService } = require("../../src/model/MenuService")
const { OrderService } = require("../../src/model/OrderService")

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

    let banchero
    let kentBeck

    beforeEach(async () => {
        const usersRepository = new TransientUsersRepository()
        userService = new UserService(usersRepository)
        menuService = new MenuService(usersRepository)
        orderService = new OrderService()

        pepperoniPizza = productFactory.createPepperoniPizza()
        meatPizza = productFactory.createMeatPizza()

        banchero = await userService.registerPizzeria(bancheroRegistrationData)
        await menuService.addToMenuOf(bancheroRegistrationData.name, pepperoniPizza)
        await menuService.addToMenuOf(bancheroRegistrationData.name, meatPizza)

        kentBeck = await userService.registerConsumer(kentRegistrationData)
    })

    it("a registered consumer can place an order", async () => {
        const orderData = {
            consumerName: kentBeck.getName(),
            pizzeriaName: banchero.getName(),
            lineItems: [{ productName: pepperoniPizza.getName(), quantity: 1 }]
        }

        await orderService.placeOrder(orderData)

        const foundOrders = await orderService.findOrdersByConsumerName(kentBeck.getName())
        expect(foundOrders).toHaveLength(1)
        expect(foundOrders[0].wasMadeBy(kentBeck)).toBe(true)
        expect(foundOrders[0].wasMadeTo(banchero)).toBe(true)
        expect(foundOrders[0].getLineItems()).toEqual(orderData.lineItems)
    })

})