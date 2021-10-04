const {UserService} = require('../../src/model/UserService')
const {TransientUsersRepository} = require("../../src/model/TransientUsersRepository");

const {
    bancheroRegistrationData,
    guerrinRegistrationData
} = require('../testObjects').pizzeriasRegistrationData

describe('Pizzeria registration', () => {
    let userService

    beforeEach(() => {
        userService = new UserService(new TransientUsersRepository())
    })

    it('can register a new pizzeria with valid registration data', async () => {
        const registeredPizzeria = await userService.registerPizzeria(bancheroRegistrationData)

        expect(registeredPizzeria.getName()).toEqual(bancheroRegistrationData.name)
        expect(registeredPizzeria.getTelephone()).toEqual(bancheroRegistrationData.telephone)
        expect(registeredPizzeria.getEmail()).toEqual(bancheroRegistrationData.email)
        expect(registeredPizzeria.getRoleName()).toEqual('pizzeria')
    })

    it("registered pizzeria's name gets trimmed", async () => {
        const registeredPizzeria = await userService.registerPizzeria({
            ...bancheroRegistrationData,
            name: `    Name    `
        })

        expect(registeredPizzeria.getName()).toEqual('Name')
    })

    it('cannot register a new pizzeria with a repeated pizzeria name', async () => {
        await userService.registerPizzeria(bancheroRegistrationData)

        const pizzeriaDataWithRepeatedName = {
            ...guerrinRegistrationData,
            name: bancheroRegistrationData.name
        }

        await expect(
            userService.registerPizzeria(pizzeriaDataWithRepeatedName)
        ).rejects.toThrow(`Pizzeria name ${pizzeriaDataWithRepeatedName.name} already registered`)
    })

    it('cannot register a new pizzeria with a repeated email', async () => {
        await userService.registerPizzeria(bancheroRegistrationData)

        const pizzeriaDataWithRepeatedName = {
            ...guerrinRegistrationData,
            email: bancheroRegistrationData.email
        }

        await expect(
            userService.registerPizzeria(pizzeriaDataWithRepeatedName)
        ).rejects.toThrow(`A user with email ${bancheroRegistrationData.email} is already registered`)
    })

    it('cannot register a new pizzeria with an empty name', async () => {
        const pizzeriaDataWithBlankName = {...bancheroRegistrationData, name: ''}

        await expectToFailPizzeriaRegistionWith(pizzeriaDataWithBlankName, "User's name cannot be blank")
    })

    it('cannot register a new pizzeria with a name containing only spaces', async () => {
        const pizzeriaDataWithBlankName = {...bancheroRegistrationData, name: ' '}

        await expectToFailPizzeriaRegistionWith(pizzeriaDataWithBlankName, "User's name cannot be blank")
    })

    it('cannot register a new pizzeria with a password of less than 6 characters', async () => {
        const pizzeriaDataWithInvalidPassword = {...bancheroRegistrationData, password: '12345'}

        await expectToFailPizzeriaRegistionWith(pizzeriaDataWithInvalidPassword, 'Password must have at least 6 characters and no empty spaces')
    })

    it('cannot register a new pizzeria with a password containing an empty space', async () => {
        const pizzeriaDataWithInvalidPassword = {...bancheroRegistrationData, password: 'pass word'}

        await expectToFailPizzeriaRegistionWith(pizzeriaDataWithInvalidPassword, 'Password must have at least 6 characters and no empty spaces')
    })

    it('cannot register a new pizzeria with an invalid email', async () => {
        await expect(userService.registerPizzeria({...bancheroRegistrationData, email: '@domain.com'})).rejects.toThrow('Invalid email')
        await expect(userService.registerPizzeria({...bancheroRegistrationData, email: 'user@.com'})).rejects.toThrow('Invalid email')
        await expect(userService.registerPizzeria({...bancheroRegistrationData, email: 'user@domain'})).rejects.toThrow('Invalid email')
        await expect(userService.registerPizzeria({...bancheroRegistrationData, email: 'user'})).rejects.toThrow('Invalid email')

        expect(await userService.existsUserWithEmail(bancheroRegistrationData.email)).toBe(false)
    })

    async function expectToFailPizzeriaRegistionWith(pizzeriaRegistrationData, expectedErrorMessage) {
        await expect(
            userService.registerPizzeria(pizzeriaRegistrationData)
        ).rejects.toThrow(expectedErrorMessage)

        expect(await userService.existsUserWithEmail(pizzeriaRegistrationData.email)).toBe(false)
    }
})