const {UserService} = require('../../src/model/UserService')
const {TransientUsersRepository} = require("../../src/model/TransientUsersRepository");
const testObjects = require('../testObjects')

const { bancheroRegistrationData } = testObjects.pizzeriasRegistrationData
const { kentRegistrationData } = testObjects.consumersRegistrationData

describe('Find Pizzeria', () => {
    let userService

    beforeEach(() => {
        userService = new UserService(new TransientUsersRepository())
    })

    it("can find pizzeria by name when it's registered", async () => {
        await userService.registerPizzeria(bancheroRegistrationData)

        const pizzeria = await userService.findPizzeriaByName(bancheroRegistrationData.name)

        expect(pizzeria.getName()).toEqual(bancheroRegistrationData.name)
        expect(pizzeria.getTelephone()).toEqual(bancheroRegistrationData.telephone)
        expect(pizzeria.getEmail()).toEqual(bancheroRegistrationData.email)
        expect(pizzeria.getRoleName()).toEqual('pizzeria')
    })

    it("cannot find pizzeria by name when it's not registered", async () => {
        await expect(
            userService.findPizzeriaByName(bancheroRegistrationData.name)
        ).rejects.toThrow(`Pizzeria ${bancheroRegistrationData.name} not found`)
    })

    it("cannot find pizzeria by name when is a consumer name", async () => {
        await userService.registerConsumer(kentRegistrationData)

        await expect(
            userService.findPizzeriaByName(kentRegistrationData.name)
        ).rejects.toThrow(`Pizzeria ${kentRegistrationData.name} not found`)
    })

})