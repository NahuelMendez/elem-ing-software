const { createServices } = require('../../src/model/serviceFactory')
const testObjects = require('../testObjects')

const { kentRegistrationData, martinRegistrationData } = testObjects.consumersRegistrationData

describe('Consumer data edition', () => {
    let userService

    beforeEach(async () => {
        const services = createServices()
        userService = services.userService

        await userService.registerConsumer(kentRegistrationData)
    })

    it ('can edit consumer data with valid data', async () => {
        const validData = {name: 'Kent', telephone: 1122334455, email: 'kent-beck@gmail.com'}

        await userService.editConsumerData(kentRegistrationData.name, validData.name, validData.telephone, validData.email)

        const consumer = await userService.findConsumerByName(validData.name)

        expect(consumer.getName()).toEqual(validData.name)
        expect(consumer.getTelephone()).toEqual(validData.telephone)
        expect(consumer.getEmail()).toEqual(validData.email)
    })

    it ('can edit consumer data with the same name', async () => {
        const validData = {name: kentRegistrationData.name, telephone: 1122334455, email: 'kent-beck@gmail.com'}

        await userService.editConsumerData(kentRegistrationData.name, validData.name, validData.telephone, validData.email)

        const consumer = await userService.findConsumerByName(kentRegistrationData.name)

        expect(consumer.getName()).toEqual(validData.name)
        expect(consumer.getTelephone()).toEqual(validData.telephone)
        expect(consumer.getEmail()).toEqual(validData.email)
    })

    it ('can edit consumer data with the same email', async () => {
        const validData = {name: 'Kent', telephone: 1122334455, email: kentRegistrationData.email}

        await userService.editConsumerData(kentRegistrationData.name, validData.name, validData.telephone, validData.email)

        const consumer = await userService.findConsumerByName(validData.name)

        expect(consumer.getName()).toEqual(validData.name)
        expect(consumer.getTelephone()).toEqual(validData.telephone)
        expect(consumer.getEmail()).toEqual(kentRegistrationData.email)
    })

    it ('cannot edit consumer data when the new email is associated with another user', async () => {
        await userService.registerConsumer(martinRegistrationData)

        const validData = {name: 'Kent', telephone: 1122334455, email: 'martin@gmail.com'}

        await expect(
            userService.editConsumerData(kentRegistrationData.name, validData.name, validData.telephone, validData.email)
        ).rejects.toThrow(`A user with email ${validData.email} is already registered`)

        await assertPersonalDataDidNotChange(kentRegistrationData)
    })

    it ('cannot edit consumer data when name is blank', async () => {
        const invalidData = {name: ' ', telephone: 1122334455, email: 'kent-beck@gmail.com'}

        await expect(
            userService.editConsumerData(kentRegistrationData.name, invalidData.name, invalidData.telephone, invalidData.email)
        ).rejects.toThrow("User's name cannot be blank")

        await assertPersonalDataDidNotChange(kentRegistrationData)
    })

    it ('cannot edit consumer data with invalid email', async () => {
        await expectToFailConsumerDataEditionWithInvalidEmail(kentRegistrationData, '@domain.com')
        await expectToFailConsumerDataEditionWithInvalidEmail(kentRegistrationData, 'user@.com')
        await expectToFailConsumerDataEditionWithInvalidEmail(kentRegistrationData, 'user@domain')
        await expectToFailConsumerDataEditionWithInvalidEmail(kentRegistrationData, 'user')

        await assertPersonalDataDidNotChange(kentRegistrationData)
    })

    function expectToFailConsumerDataEditionWithInvalidEmail(consumer, invalidEmail) {
        return expect(
            userService.editConsumerData(consumer.name, consumer.name, consumer.telephone, invalidEmail)
        ).rejects.toThrow("Invalid email")
    }

    async function assertPersonalDataDidNotChange(consumerData) {
        const consumer = await userService.findConsumerByName(consumerData.name)
    
        expect(consumer.getName()).toEqual(consumerData.name)
        expect(consumer.getTelephone()).toEqual(consumerData.telephone)
        expect(consumer.getEmail()).toEqual(consumerData.email)
    }

})
