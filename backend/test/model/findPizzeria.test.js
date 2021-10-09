const {UserService} = require('../../src/model/UserService')
const {TransientUsersRepository} = require("../../src/model/TransientUsersRepository");

const {
    bancheroRegistrationData
} = require('../testObjects').pizzeriasRegistrationData

describe('Find Pizzeria', () => {
    let userService

    beforeEach(() => {
        userService = new UserService(new TransientUsersRepository())
    })

    it("can get pizzeria when it's registered", async () => {
        await userService.registerPizzeria(bancheroRegistrationData)

        const pizzeria = await userService.findPizzeriaByName(bancheroRegistrationData.name)

        expect(pizzeria.getName()).toEqual(bancheroRegistrationData.name)
        expect(pizzeria.getTelephone()).toEqual(bancheroRegistrationData.telephone)
        expect(pizzeria.getEmail()).toEqual(bancheroRegistrationData.email)
        expect(pizzeria.getRoleName()).toEqual('pizzeria')
    })

    it("cannot get pizzeria when it's not registered", async () => {
        await expect(
            userService.findPizzeriaByName(bancheroRegistrationData.name)
        ).rejects.toThrow(`Pizzeria ${bancheroRegistrationData.name} not found`)
    })

})