const {UserService} = require('../../src/model/UserService')
const {TransientUsersRepository} = require("../../src/model/TransientUsersRepository");

const {
    kentRegistrationData
} = require('../testObjects').consumersRegistrationData

describe('Consumer search', () => {
    let userService

    beforeEach(() => {
        userService = new UserService(new TransientUsersRepository())
    })

    it('a registered consumer can be found by name', async () => {
        await userService.registerConsumer(kentRegistrationData)

        const foundConsumer = await userService.findConsumerByName(kentRegistrationData.name)

        expect(foundConsumer.getName()).toEqual(kentRegistrationData.name)
        expect(foundConsumer.getTelephone()).toEqual(kentRegistrationData.telephone)
        expect(foundConsumer.getEmail()).toEqual(kentRegistrationData.email)
        expect(foundConsumer.getRoleName()).toEqual('consumer')
    })

})