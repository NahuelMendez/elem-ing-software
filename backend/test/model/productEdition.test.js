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

        const products = await menuService.productsInMenuOf(bancheroRegistrationData.name)

        expect(products).toHaveLength(1)
        expect(products[0].getName()).toEqual(meatPizza.getName())
        expect(products[0].getDescription()).toEqual(meatPizza.getDescription())
        expect(products[0].getPrice()).toEqual(meatPizza.getPrice())
        expect(products[0].getImageURL()).toEqual(meatPizza.getImageURL())
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

        expect(products).toHaveLength(2)

        expect(products[0].getName()).toEqual(pepperoniPizza.getName())
        expect(products[0].getDescription()).toEqual(pepperoniPizza.getDescription())
        expect(products[0].getPrice()).toEqual(pepperoniPizza.getPrice())
        expect(products[0].getImageURL()).toEqual(pepperoniPizza.getImageURL())

        expect(products[1].getName()).toEqual(meatPizza.getName())
        expect(products[1].getDescription()).toEqual(meatPizza.getDescription())
        expect(products[1].getPrice()).toEqual(meatPizza.getPrice())
        expect(products[1].getImageURL()).toEqual(meatPizza.getImageURL())
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

})