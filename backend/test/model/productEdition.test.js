const {UserService} = require('../../src/model/UserService')
const {MenuService} = require("../../src/model/MenuService");
const {TransientUsersRepository} = require("../../src/model/TransientUsersRepository");
const productFactory = require("../helpers/productFactory");

const {
    bancheroRegistrationData,
    guerrinRegistrationData
} = require('../testObjects').pizzeriasRegistrationData

describe('Pizzeria registration', () => {
    let userService
    let menuService

    let pepperoniPizza
    let meatPizza

    beforeEach(() => {
        usersRepository = new TransientUsersRepository()
        userService = new UserService(usersRepository)
        menuService = new MenuService(usersRepository)

        pepperoniPizza = productFactory.createPepperoniPizza()
        meatPizza = productFactory.createMeatPizza()
    })

    it('a product from the menu of a registered pizzeria can be updated with a reference product', async () => {
        await userService.registerPizzeria(bancheroRegistrationData)
        await menuService.addToMenuOf(bancheroRegistrationData.name, pepperoniPizza)

        await menuService.updateProduct({
            pizzeriaName: bancheroRegistrationData.name,
            nameOfProductToUpdate: pepperoniPizza.name,
            referenceProduct: meatPizza
        })

        await expectHasMenuWith([meatPizza], bancheroRegistrationData.name)
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
        expectedProducts.forEach(expectedProduct =>
            expect(foundProducts).toContain(expectedProduct)
        )
    }

})