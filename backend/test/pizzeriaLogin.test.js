const {UserService} = require('../src/model/UserService')
const {TransientUsersRepository} = require("../src/model/TransientUsersRepository");

const {
    bancheroRegistrationData,
    guerrinRegistrationData
} = require('./testObjects').pizzeriasRegistrationData

describe('Pizzeria login', () => {
    let userService

    beforeEach(() => {
        userService = new UserService(new TransientUsersRepository())
    })

    it('can login a registered pizzeria with valid username and password', async () => {
        await userService.registerPizzeria(bancheroRegistrationData)

        const loggedInPizzeria = await userService.login({
            username: bancheroRegistrationData.name,
            password: bancheroRegistrationData.password
        })

        expect(loggedInPizzeria.getName()).toEqual(bancheroRegistrationData.name)
        expect(loggedInPizzeria.getTelephone()).toEqual(bancheroRegistrationData.telephone)
        expect(loggedInPizzeria.getEmail()).toEqual(bancheroRegistrationData.email)
    })

    it('can login another registered pizzeria with valid username and password', async () => {
        await userService.registerPizzeria(bancheroRegistrationData)
        await userService.registerPizzeria(guerrinRegistrationData)

        const loggedInPizzeria = await userService.login({
            username: guerrinRegistrationData.name,
            password: guerrinRegistrationData.password
        })

        expect(loggedInPizzeria.getName()).toEqual(guerrinRegistrationData.name)
        expect(loggedInPizzeria.getTelephone()).toEqual(guerrinRegistrationData.telephone)
        expect(loggedInPizzeria.getEmail()).toEqual(guerrinRegistrationData.email)
    })

    it('cannot login with invalid username', async () => {
        await userService.registerPizzeria(bancheroRegistrationData)

        await expect(
            userService.login({
                username: 'invalid username',
                password: guerrinRegistrationData.password
            })
        ).rejects.toThrow('Invalid username or password')
    })

    it('cannot login with invalid password', async () => {
        await userService.registerPizzeria(bancheroRegistrationData)

        await expect(
            userService.login({
                username: bancheroRegistrationData.name,
                password: 'invalid password'
            })
        ).rejects.toThrow('Invalid username or password')
    })

})