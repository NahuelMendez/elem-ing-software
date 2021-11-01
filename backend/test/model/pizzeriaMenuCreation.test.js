const time = require('../time')
const sinon = require('sinon')
sinon.stub(time, 'setTimeout')

const { createServices, afterTestCleaning } = require('../../src/model/serviceFactory')

const testObjects = require('../testObjects')
const productFactory = require('../helpers/productFactory')

const { bancheroRegistrationData } = testObjects.pizzeriasRegistrationData

describe("Pizzeria's menu creation", () => {
    let userService
    let menuService

    let pepperoniPizza
    let meatPizza

    beforeEach(() => {
        const services = createServices()
        userService = services.userService
        menuService = services.menuService

        pepperoniPizza = productFactory.createPepperoniPizza()
        meatPizza = productFactory.createMeatPizza()
    })

    afterEach(async () => {
        await afterTestCleaning()
    })

    it("a registered pizzeria starts with no products on it's menu", async () => {
        await userService.registerPizzeria(bancheroRegistrationData)

        await expectHasNoProductsInMenu(bancheroRegistrationData.name)
    })

    it(`a registered pizzeria can add a new product to it's menu`, async () => {
        await userService.registerPizzeria(bancheroRegistrationData)

        await menuService.addToMenuOf(bancheroRegistrationData.name, pepperoniPizza)

        await expectHasMenuWith([pepperoniPizza], bancheroRegistrationData.name)
    })

    it(`a registered pizzeria can add many products with different names to it's menu`, async () => {
        await userService.registerPizzeria(bancheroRegistrationData)
        await menuService.addToMenuOf(bancheroRegistrationData.name, pepperoniPizza)

        await menuService.addToMenuOf(bancheroRegistrationData.name, meatPizza)

        await expectHasMenuWith([pepperoniPizza, meatPizza], bancheroRegistrationData.name)
    })

    it('cannot add a product to a menu for a not registered pizzeria', async () => {
        await expect(
            menuService.addToMenuOf(bancheroRegistrationData.name, pepperoniPizza)
        ).rejects.toThrow(`Pizzeria ${bancheroRegistrationData.name} not found`)
    })

    it("a pizzeria's menu cannot have products with repeated name", async () => {
        const firstProduct = productFactory.createProductWith({name: 'RepeatedName'})
        const productWithRepeatedName = productFactory.createProductWith({name: 'RepeatedName'})

        await userService.registerPizzeria(bancheroRegistrationData)
        await menuService.addToMenuOf(bancheroRegistrationData.name, firstProduct)

        await expect(
            menuService.addToMenuOf(bancheroRegistrationData.name, productWithRepeatedName)
        ).rejects.toThrow('A menu cannot have repeated product names')

        await expectHasMenuWith([firstProduct], bancheroRegistrationData.name)
    })

    async function expectHasNoProductsInMenu(pizzeriaName) {
        await expectHasMenuWith([], pizzeriaName)
    }

    async function expectHasMenuWith(expectedProducts, pizzeriaName) {
        const foundProducts = await menuService.productsInMenuOf(pizzeriaName)

        expect(foundProducts).toHaveLength(expectedProducts.length)

        expectedProducts.forEach(expectedProduct => {
            expect(
                foundProducts.some(foundProduct => foundProduct.equals(expectedProduct)
            )).toBe(true)
        })
    }

})