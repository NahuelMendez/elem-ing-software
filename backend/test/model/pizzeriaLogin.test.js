const { createServices } = require('../../src/model/serviceFactory')

const {
    bancheroRegistrationData,
    guerrinRegistrationData
} = require('../testObjects').pizzeriasRegistrationData

describe('Pizzeria login', () => {
    let userService

    beforeEach(() => {
        const services = createServices()
        userService = services.userService
    })

    it('can login a registered pizzeria with valid credentials', async () => {
        await userService.registerPizzeria(bancheroRegistrationData)

        const loggedInPizzeria = await userService.login({
            email: bancheroRegistrationData.email,
            password: bancheroRegistrationData.password
        })

        expect(loggedInPizzeria.getName()).toEqual(bancheroRegistrationData.name)
        expect(loggedInPizzeria.getTelephone()).toEqual(bancheroRegistrationData.telephone)
        expect(loggedInPizzeria.getEmail()).toEqual(bancheroRegistrationData.email)
    })

    it('can login another registered pizzeria with valid credentials', async () => {
        await userService.registerPizzeria(bancheroRegistrationData)
        await userService.registerPizzeria(guerrinRegistrationData)

        const loggedInPizzeria = await userService.login({
            email: guerrinRegistrationData.email,
            password: guerrinRegistrationData.password
        })

        expect(loggedInPizzeria.getName()).toEqual(guerrinRegistrationData.name)
        expect(loggedInPizzeria.getTelephone()).toEqual(guerrinRegistrationData.telephone)
        expect(loggedInPizzeria.getEmail()).toEqual(guerrinRegistrationData.email)
    })

    it('cannot login with invalid email', async () => {
        await userService.registerPizzeria(bancheroRegistrationData)

        await expect(
            userService.login({
                email: 'invalid@email.com',
                password: guerrinRegistrationData.password
            })
        ).rejects.toThrow('Invalid email or password')
    })

    it('cannot login with invalid password', async () => {
        await userService.registerPizzeria(bancheroRegistrationData)

        await expect(
            userService.login({
                username: bancheroRegistrationData.name,
                password: 'invalid password'
            })
        ).rejects.toThrow('Invalid email or password')
    })

})