const { createServices } = require('../../src/model/serviceFactory')

const {
    kentRegistrationData
} = require('../testObjects').consumersRegistrationData

const {
    bancheroRegistrationData
} = require('../testObjects').pizzeriasRegistrationData

const { createPizzeriaRegistrationData } = require('../testObjects')

const { createProductWith } = require('../helpers/productFactory')


describe('Pizzas bestseller', () => {
    let userService
    let menuService
    let orderService

    beforeEach(async () => {
        const services = createServices()
        userService = services.userService
        menuService = services.menuService
        orderService = services.orderService
    })

    it('given there is only one order in the system, when ask for the pizzas with the most sells, then the result should contain the bestsellers from that order sorted by most selled', async () => {
        await userService.registerConsumer(kentRegistrationData)
        const banchero = await userService.registerPizzeria(bancheroRegistrationData)

        const pizzas = [
            createProductWith({name: 'Product A'}),
            createProductWith({name: 'Product B'}),
            createProductWith({name: 'Product C'}),
            createProductWith({name: 'Product D'})
        ]

        for (let pizza of pizzas)
            await menuService.addToMenuOf(bancheroRegistrationData.name, pizza)

        await orderService.placeOrder({
            consumerName: kentRegistrationData.name,
            pizzeriaName: bancheroRegistrationData.name,
            lineItems: [
                { productName: pizzas[0].getName(), quantity: 10 },
                { productName: pizzas[1].getName(), quantity: 20 },
                { productName: pizzas[2].getName(), quantity: 30 },
                { productName: pizzas[3].getName(), quantity: 1 }
            ]
        })

        const topThree = await orderService.pizzasBestsellers({ limit: 3 })
        expect(topThree).toHaveLength(3)
        expect(topThree[0]).toEqual({ pizzeria: banchero, product: pizzas[2], totalSellsQuantity: 30 })
        expect(topThree[1]).toEqual({ pizzeria: banchero, product: pizzas[1], totalSellsQuantity: 20 })
        expect(topThree[2]).toEqual({ pizzeria: banchero, product: pizzas[0], totalSellsQuantity: 10 })
    })

    it('given there are many order with repeated products of the same pizzeria, when ask for the pizzas with the most sells, then the total sells quantity for these pizzas should be added', async () => {
        await userService.registerConsumer(kentRegistrationData)
        const banchero = await userService.registerPizzeria(bancheroRegistrationData)

        const pizzas = [
            createProductWith({name: 'Product A'}),
            createProductWith({name: 'Product B'})
        ]

        for (let pizza of pizzas)
            await menuService.addToMenuOf(bancheroRegistrationData.name, pizza)

        await orderService.placeOrder({
            consumerName: kentRegistrationData.name,
            pizzeriaName: bancheroRegistrationData.name,
            lineItems: [
                { productName: pizzas[0].getName(), quantity: 11 },
                { productName: pizzas[1].getName(), quantity: 10 }
            ]
        })

        await orderService.placeOrder({
            consumerName: kentRegistrationData.name,
            pizzeriaName: bancheroRegistrationData.name,
            lineItems: [
                { productName: pizzas[1].getName(), quantity: 9 }
            ]
        })

        const topThree = await orderService.pizzasBestsellers({ limit: 3 })
        expect(topThree).toHaveLength(2)
        expect(topThree[0]).toEqual({ pizzeria: banchero, product: pizzas[1], totalSellsQuantity: 19 })
        expect(topThree[1]).toEqual({ pizzeria: banchero, product: pizzas[0], totalSellsQuantity: 11 })
    })

    it('when many products of different pizzerias with the same name have the same sells quantity those products appears sorted by pizzeria name in the ranking', async () => {
        await userService.registerConsumer(kentRegistrationData)

        const pizzeriaA = await userService.registerPizzeria(createPizzeriaRegistrationData({name: 'pizzeria a'}))
        const pizzeriaB = await userService.registerPizzeria(createPizzeriaRegistrationData({name: 'pizzeria b'}))
        const pizzeriaC = await userService.registerPizzeria(createPizzeriaRegistrationData({name: 'pizzeria c'}))

        const pizza = createProductWith({name: 'Pizza'})

        for (let pizzeria of [pizzeriaB, pizzeriaA, pizzeriaC]) {
            await menuService.addToMenuOf(pizzeria.getName(), pizza)

            await orderService.placeOrder({
                consumerName: kentRegistrationData.name,
                pizzeriaName: pizzeria.getName(),
                lineItems: [{ productName: pizza.getName(), quantity: 1 }]
            })
        }

        const topThree = await orderService.pizzasBestsellers({ limit: 3 })
        expect(topThree).toHaveLength(3)
        expect(topThree[0]).toEqual({ pizzeria: pizzeriaA, product: pizza, totalSellsQuantity: 1 })
        expect(topThree[1]).toEqual({ pizzeria: pizzeriaB, product: pizza, totalSellsQuantity: 1 })
        expect(topThree[2]).toEqual({ pizzeria: pizzeriaC, product: pizza, totalSellsQuantity: 1 })
    })

})