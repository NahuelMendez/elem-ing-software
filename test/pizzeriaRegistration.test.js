const {UserService} = require('../src/model/UserService')
const {TransientUsersRepository} = require("../src/model/TransientUsersRepository");

const {
    bancheroRegistrationData,
    guerrinRegistrationData
} = require('./testObjects').pizzeriasRegistrationData

describe('Pizzeria registration', () => {
    let userService

    beforeEach(() => {
        userService = new UserService(new TransientUsersRepository())
    })

    it('can register a new pizzeria with valid registration data', async () => {
        const pizzeriaRegistrada = await userService.registerPizzeria(bancheroRegistrationData)

        expect(pizzeriaRegistrada.getName()).toEqual(bancheroRegistrationData.name)
        expect(pizzeriaRegistrada.getTelephone()).toEqual(bancheroRegistrationData.telephone)
        expect(pizzeriaRegistrada.getEmail()).toEqual(bancheroRegistrationData.email)
    })

    it('registered pizzeria name gets trimmed', async () => {
        const pizzeriaRegistrada = await userService.registerPizzeria({
            ...bancheroRegistrationData,
            name: `    Name    `
        })

        expect(pizzeriaRegistrada.getName()).toEqual('Name')
    })

    it('cannot register a new pizzeria with a repeated pizzeria name', async () => {
        await userService.registerPizzeria(bancheroRegistrationData)
        
        const pizzeriaConNombreRepetidoData = {
            ...guerrinRegistrationData,
            name: bancheroRegistrationData.name
        }
        
        await expect(
            userService.registerPizzeria(pizzeriaConNombreRepetidoData)
        ).rejects.toThrow(`Pizzeria name ${pizzeriaConNombreRepetidoData.name} already registered`)
    })

    it('cannot register a new pizzeria with an empty name', async () => {
        const pizzeriaWithBlankNameData = {
            ...bancheroRegistrationData,
            name: ''
        }
        
        await expect(
            userService.registerPizzeria(pizzeriaWithBlankNameData)
        ).rejects.toThrow(`Pizzeria's name cannot be blank`)

        expect(await userService.existsPizzeriaNamed(pizzeriaWithBlankNameData.name)).toBe(false)
    })

    it('cannot register a new pizzeria with a name containing only spaces', async () => {
        const pizzeriaWithBlankNameData = {
            ...bancheroRegistrationData,
            name: ' '
        }
        
        await expect(
            userService.registerPizzeria(pizzeriaWithBlankNameData)
        ).rejects.toThrow(`Pizzeria's name cannot be blank`)

        expect(await userService.existsPizzeriaNamed(pizzeriaWithBlankNameData.name)).toBe(false)
    })

    it('cannot register a new pizzeria with a password of less than 6 characters', async () => {
        const pizzeriaWithInvalidPassword = {
            ...bancheroRegistrationData,
            password: '12345'
        }
        
        await expect(
            userService.registerPizzeria(pizzeriaWithInvalidPassword)
        ).rejects.toThrow('Password must have at least 6 characters and no empty spaces')

        expect(await userService.existsPizzeriaNamed(pizzeriaWithInvalidPassword.name)).toBe(false)
    })

    it('cannot register a new pizzeria with a password containing an empty space', async () => {
        const pizzeriaWithInvalidPasswordData = {
            ...bancheroRegistrationData,
            password: 'pass word'
        }
        
        await expect(
            userService.registerPizzeria(pizzeriaWithInvalidPasswordData)
        ).rejects.toThrow(`Password must have at least 6 characters and no empty spaces`)

        expect(await userService.existsPizzeriaNamed(pizzeriaWithInvalidPasswordData.name)).toBe(false)
    })

    it('cannot register a new pizzeria with an invalid email', async () => {
        await expect(userService.registerPizzeria({...bancheroRegistrationData, email: '@domain.com'})).rejects.toThrow('Invalid email')
        await expect(userService.registerPizzeria({...bancheroRegistrationData, email: 'user@.com'})).rejects.toThrow('Invalid email')
        await expect(userService.registerPizzeria({...bancheroRegistrationData, email: 'user@domain'})).rejects.toThrow('Invalid email')
        await expect(userService.registerPizzeria({...bancheroRegistrationData, email: 'user'})).rejects.toThrow('Invalid email')

        expect(await userService.existsPizzeriaNamed(bancheroRegistrationData.name)).toBe(false)
    })

})