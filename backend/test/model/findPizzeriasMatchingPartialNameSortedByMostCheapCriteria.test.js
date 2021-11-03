const { createServices } = require('../../src/model/serviceFactory')
const { Product } = require("../../src/model/Product");

const {
    createPizzeriaRegistrationData,
    createConsumerRegistrationData,
    createPizzaData
} = require('../testObjects')

describe('Find Pizzerias matching partial name sorted by most cheap criteria', () => {
    let userService
    let menuService

    let pizzeriaA1
    let pizzeriaA2
    let pizzeriaA3
    let pizzeriaB

    let productWithPrice1Peso
    let productWithPrice2Pesos
    let productWithPrice3Pesos
    let productWithPrice1000Pesos

    beforeEach(() => {
        const services = createServices()
        userService = services.userService
        menuService = services.menuService

        pizzeriaA1 = createPizzeriaRegistrationData({name: 'pizzeria a1'})
        pizzeriaA2 = createPizzeriaRegistrationData({name: 'pizzeria a2'})
        pizzeriaA3 = createPizzeriaRegistrationData({name: 'pizzeria a3'})
        pizzeriaB = createPizzeriaRegistrationData({name: 'pizzeria b'})

        productWithPrice1Peso = new Product(createPizzaData({name: 'a', price: 1}))
        productWithPrice2Pesos = new Product(createPizzaData({name: 'b', price: 2}))
        productWithPrice3Pesos = new Product(createPizzaData({name: 'c', price: 3}))
        productWithPrice1000Pesos = new Product(createPizzaData({name: 'c', price: 1000}))
    })

    it('can find pizzerias matching a partial name sorted by most cheap', async () => {
        await userService.registerPizzeria(pizzeriaA1)
        await menuService.addToMenuOf(pizzeriaA1.name, productWithPrice1Peso)
        await menuService.addToMenuOf(pizzeriaA1.name, productWithPrice1000Pesos)

        await userService.registerPizzeria(pizzeriaA2)
        await menuService.addToMenuOf(pizzeriaA2.name, productWithPrice1Peso)

        await userService.registerPizzeria(pizzeriaA3)
        await menuService.addToMenuOf(pizzeriaA3.name, productWithPrice1Peso)
        await menuService.addToMenuOf(pizzeriaA3.name, productWithPrice2Pesos)
        await menuService.addToMenuOf(pizzeriaA3.name, productWithPrice3Pesos)

        await userService.registerPizzeria(pizzeriaB)
        await menuService.addToMenuOf(pizzeriaB.name, productWithPrice1Peso)

        const foundPizzerias = await userService.findPizzeriasByPartialNameSortedByMostCheap('pizzeria a')

        expect(foundPizzerias).toHaveLength(3)
        expect(foundPizzerias[0].isNamed(pizzeriaA2.name)).toBe(true)
        expect(foundPizzerias[1].isNamed(pizzeriaA3.name)).toBe(true)
        expect(foundPizzerias[2].isNamed(pizzeriaA1.name)).toBe(true)
    })

    it('finding pizzerias matching a partial name sorted by most cheap is case insensitive', async () => {
        await userService.registerPizzeria(pizzeriaA1)
        await menuService.addToMenuOf(pizzeriaA1.name, productWithPrice1Peso)

        const foundPizzerias = await userService.findPizzeriasByPartialNameSortedByMostCheap('pIzZeRiA')

        expect(foundPizzerias).toHaveLength(1)
        expect(foundPizzerias[0].isNamed(pizzeriaA1.name)).toBe(true)
    })

    it('finding pizzerias matching a partial name sorted by most cheap ignore consumers', async () => {
        const kentConsumerData = createConsumerRegistrationData({name: 'Kent'})
        await userService.registerConsumer(kentConsumerData)

        const foundPizzerias = await userService.findPizzeriasByPartialNameSortedByMostCheap(kentConsumerData.name[0])

        expect(foundPizzerias).toHaveLength(0)
    })

    it('finding pizzerias matching a partial name sorted by most cheap ignore pizzerias without products', async () => {
        await userService.registerPizzeria(pizzeriaA1)

        const foundPizzerias = await userService.findPizzeriasByPartialNameSortedByMostCheap(pizzeriaA1.name)

        expect(foundPizzerias).toHaveLength(0)
    })

})