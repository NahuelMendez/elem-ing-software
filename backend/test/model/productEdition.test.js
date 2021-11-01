const time = require('../time')
const sinon = require('sinon')
sinon.stub(time, 'setTimeout')

const { createServices, afterTestCleaning } = require('../../src/model/serviceFactory')

const productFactory = require("../helpers/productFactory");

const {
    bancheroRegistrationData,
    guerrinRegistrationData
} = require('../testObjects').pizzeriasRegistrationData

describe(`Edit product of pizzeria's menu`, () => {
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

    it('a product from the menu of a registered pizzeria can be updated with a reference product with a different name', async () => {
        await userService.registerPizzeria(bancheroRegistrationData)
        await menuService.addToMenuOf(bancheroRegistrationData.name, pepperoniPizza)

        await menuService.updateProduct({
            pizzeriaName: bancheroRegistrationData.name,
            nameOfProductToUpdate: pepperoniPizza.name,
            referenceProduct: meatPizza
        })

        await expectHasMenuWith([meatPizza], bancheroRegistrationData.name)
    })

    it('a product from the menu of a registered pizzeria can be updated with a reference product with the same name', async () => {
        const anotherPepperoniPizza = productFactory.createProductWith({
            name: pepperoniPizza.name,
            description: pepperoniPizza.description + '!!!'
        })

        await userService.registerPizzeria(bancheroRegistrationData)
        await menuService.addToMenuOf(bancheroRegistrationData.name, pepperoniPizza)

        await menuService.updateProduct({
            pizzeriaName: bancheroRegistrationData.name,
            nameOfProductToUpdate: pepperoniPizza.name,
            referenceProduct: anotherPepperoniPizza
        })

        await expectHasMenuWith([anotherPepperoniPizza], bancheroRegistrationData.name)
    })

    it('cannot update a product for a not registered pizzeria', async () => {
        await expect(
            menuService.updateProduct({
                pizzeriaName: bancheroRegistrationData.name,
                nameOfProductToUpdate: pepperoniPizza.name,
                referenceProduct: meatPizza
            })
        ).rejects.toThrow(`Pizzeria ${bancheroRegistrationData.name}`)
    })

    it('cannot update the name of a product in a menu when another product in that menu has that name', async () => {
        await userService.registerPizzeria(bancheroRegistrationData)
        await menuService.addToMenuOf(bancheroRegistrationData.name, pepperoniPizza)
        await menuService.addToMenuOf(bancheroRegistrationData.name, meatPizza)

        const anotherMeatPizza = productFactory.createMeatPizza()

        await expect(
            menuService.updateProduct({
                pizzeriaName: bancheroRegistrationData.name,
                nameOfProductToUpdate: pepperoniPizza.name,
                referenceProduct: anotherMeatPizza
            })
        ).rejects.toThrow(`A menu cannot have repeated product names`)

        const products = await menuService.productsInMenuOf(bancheroRegistrationData.name)

        await expectHasMenuWith([pepperoniPizza, meatPizza], bancheroRegistrationData.name)
    })

    it('cannot update a product for a registered pizzeria with a product name not mathing any product name in the menu', async () => {
        await userService.registerPizzeria(bancheroRegistrationData)
        await menuService.addToMenuOf(bancheroRegistrationData.name, pepperoniPizza)

        const missingProductName = 'MISSING PRODUCT NAME'
        await expect(
            menuService.updateProduct({
                pizzeriaName: bancheroRegistrationData.name,
                nameOfProductToUpdate: missingProductName,
                referenceProduct: meatPizza
            })
        ).rejects.toThrow(`Product ${missingProductName} not found`)
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