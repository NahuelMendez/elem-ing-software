const time = require('../time')
const sinon = require('sinon')
sinon.stub(time, 'setTimeout')

const { createServices, afterTestCleaning } = require('../../src/model/serviceFactory')

const {
    kentRegistrationData
} = require('../testObjects').consumersRegistrationData

const { bancheroRegistrationData } = require('../testObjects').pizzeriasRegistrationData


describe('Consumer search', () => {
    let userService

    beforeEach(() => {
        const services = createServices()
        userService = services.userService
    })

    afterEach(async () => {
        await afterTestCleaning()
    })

    it('a registered consumer can be found by name', async () => {
        await userService.registerConsumer(kentRegistrationData)

        const foundConsumer = await userService.findConsumerByName(kentRegistrationData.name)

        expect(foundConsumer.getName()).toEqual(kentRegistrationData.name)
        expect(foundConsumer.getTelephone()).toEqual(kentRegistrationData.telephone)
        expect(foundConsumer.getEmail()).toEqual(kentRegistrationData.email)
        expect(foundConsumer.getRoleName()).toEqual('consumer')
    })

    it("cannot find a consumer by name when it's not registered", async () => {
        await expect(
            userService.findConsumerByName(kentRegistrationData.name)
        ).rejects.toThrow(`Consumer ${kentRegistrationData.name} not found`)
    })

    it("cannot find consumer by name for a registered pizzeria name", async () => {
        await userService.registerPizzeria(bancheroRegistrationData)

        await expect(
            userService.findConsumerByName(bancheroRegistrationData.name)
        ).rejects.toThrow(`Consumer ${bancheroRegistrationData.name} not found`)
    })

})