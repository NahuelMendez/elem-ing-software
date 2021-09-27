const { TransientUsersRepository } = require("../src/model/TransientUsersRepository");
const { UserService } = require('../src/model/UserService')
const { MenuService } = require("../src/model/MenuService");

const testObjects = require('./testObjects')
const productFactory = require('./helpers/productFactory')

const { bancheroRegistrationData } = testObjects.pizzeriasRegistrationData

describe("Pizzeria's menu creation", () => {
    let userService
    let menuService

    let pepperoniPizza
    let meatPizza

    beforeEach(() => {
        const usersRepository = new TransientUsersRepository()
        userService = new UserService(usersRepository)
        menuService = new MenuService(usersRepository)

        pepperoniPizza = productFactory.createPepperoniPizza()
        meatPizza = productFactory.createMeatPizza()
    })

    it("a registered pizzeria starts with no products on it's menu", async () => {
        await userService.registerPizzeria(bancheroRegistrationData)

        await expectHasNoProductsInMenu(bancheroRegistrationData.name)
    })

    it('a registered pizzeria can create a menu', async () => {
        await userService.registerPizzeria(bancheroRegistrationData)

        await menuService.createMenu(bancheroRegistrationData.name, [pepperoniPizza, meatPizza])

        await expectHasMenuWith([pepperoniPizza, meatPizza], bancheroRegistrationData.name)
    })

    it('cannot create a menu for a not registered pizzeria', async () => {
        await expect(
            menuService.createMenu(bancheroRegistrationData.name, [pepperoniPizza])
        ).rejects.toThrow(`Pizzeria ${bancheroRegistrationData.name} not found`)
    })

    it("a pizzeria's menu cannot have products with repeated name", async () => {
        await userService.registerPizzeria(bancheroRegistrationData)

        await expect(
            menuService.createMenu(
                bancheroRegistrationData.name,
                [
                    productFactory.createProductWith({name: 'RepeatedName'}),
                    productFactory.createProductWith({name: 'RepeatedName'})
                ]
            )
        ).rejects.toThrow('A menu cannot have repeated product names')

        await expectHasNoProductsInMenu(bancheroRegistrationData.name)
    })

    async function expectHasNoProductsInMenu(pizzeriaName) {
        await expectHasMenuWith([], pizzeriaName)
    }

    async function expectHasMenuWith(expectedProducts, pizzeriaName) {
        const foundProducts = await menuService.productsInMenuOf(pizzeriaName)

        expect(foundProducts).toHaveLength(expectedProducts.length)
        expectedProducts.forEach(expectedProduct =>
            expect(foundProducts).toContain(expectedProduct)
        )
    }

})