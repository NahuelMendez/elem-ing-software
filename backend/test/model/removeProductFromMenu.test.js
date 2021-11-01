const time = require('../time')
const sinon = require('sinon')
sinon.stub(time, 'setTimeout')

const { createServices, afterTestCleaning } = require('../../src/model/serviceFactory')

const testObjects = require('../testObjects')
const productFactory = require('../helpers/productFactory')

const { bancheroRegistrationData } = testObjects.pizzeriasRegistrationData
const { kentRegistrationData } = testObjects.consumersRegistrationData

describe("Remove product from menu", () => {
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

    it(`a pizzeria can remove a product by name from it's menu`, async () => {
        await userService.registerPizzeria(bancheroRegistrationData)
        await menuService.addToMenuOf(bancheroRegistrationData.name, pepperoniPizza)
        await menuService.addToMenuOf(bancheroRegistrationData.name, meatPizza)

        await menuService.removeProduct(bancheroRegistrationData.name, meatPizza.name)

        await expectHasMenuWith([pepperoniPizza], bancheroRegistrationData.name)
    })

    it(`a pizzeria can remove a product by a name containing trailing spaces from it's menu`, async () => {
        await userService.registerPizzeria(bancheroRegistrationData)
        await menuService.addToMenuOf(bancheroRegistrationData.name, pepperoniPizza)
        await menuService.addToMenuOf(bancheroRegistrationData.name, meatPizza)

        await menuService.removeProduct(bancheroRegistrationData.name, `  ${meatPizza.name}  `)

        await expectHasMenuWith([pepperoniPizza], bancheroRegistrationData.name)
    })

    it(`a pizzeria cannot remove form it's menu a product that does not have`, async () => {
        const productData = productFactory.createProductWith({})

        await userService.registerPizzeria(bancheroRegistrationData)
        await menuService.addToMenuOf(bancheroRegistrationData.name, productData)

        const missingProductName = `MISSING_PRODUCT`
        await expect(
            menuService.removeProduct(bancheroRegistrationData.name, missingProductName)
        ).rejects.toThrow(`Product ${missingProductName} not found`)

        await expectHasMenuWith([productData], bancheroRegistrationData.name)
    })

    it(`cannot remove a product for a not registered pizzeria`, async () => {
        const notRegisteredPizzeriaName = 'NOT_REGISTERED'
        await expect(
            menuService.removeProduct(notRegisteredPizzeriaName, meatPizza.name)
        ).rejects.toThrow(`Pizzeria ${notRegisteredPizzeriaName} not found`)
    })

    it(`cannot remove a product for a consumer`, async () => {
        await userService.registerConsumer(kentRegistrationData)

        await expect(
            menuService.removeProduct(kentRegistrationData.name, meatPizza.name)
        ).rejects.toThrow(`Pizzeria ${kentRegistrationData.name} not found`)
    })

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