const {UserService} = require('../src/model/UserService')
const {TransientUsersRepository} = require("../src/model/TransientUsersRepository");

const {
    kentRegistrationData,
    martinRegistrationData
} = require('./testObjects').consumersRegistrationData

describe('Consumer registration', () => {
    let userService

    beforeEach(() => {
        userService = new UserService(new TransientUsersRepository())
    })

    it('can register a new consumer with valid registration data', async () => {
        const registeredConsumer = await userService.registerConsumer(kentRegistrationData)

        expect(registeredConsumer.getName()).toEqual(kentRegistrationData.name)
        expect(registeredConsumer.getTelephone()).toEqual(kentRegistrationData.telephone)
        expect(registeredConsumer.getEmail()).toEqual(kentRegistrationData.email)
        expect(registeredConsumer.getRoleName()).toEqual('consumer')
    })

    it("registered consumer's name gets trimmed", async () => {
        const registeredConsumer = await userService.registerConsumer({
            ...kentRegistrationData,
            name: `    Name    `
        })

        expect(registeredConsumer.getName()).toEqual('Name')
    })

    it('cannot register a new consumer with a repeated name', async () => {
        await userService.registerConsumer(kentRegistrationData)

        const consumerDataWithRepeatedName = {
            ...martinRegistrationData,
            name: kentRegistrationData.name
        }

        await expect(
            userService.registerConsumer(consumerDataWithRepeatedName)
        ).rejects.toThrow(`Consumer name ${consumerDataWithRepeatedName.name} already registered`)
    })

    it('cannot register a new consumer with a repeated email', async () => {
        await userService.registerConsumer(kentRegistrationData)

        const consumerDataWithRepeatedName = {
            ...martinRegistrationData,
            email: kentRegistrationData.email
        }

        await expect(
            userService.registerConsumer(consumerDataWithRepeatedName)
        ).rejects.toThrow(`A user with email ${kentRegistrationData.email} is already registered`)
    })

    it('cannot register a new consumer with an empty name', async () => {
        const consumerDataWithBlankName = {...kentRegistrationData, name: ''}

        await expectToFailConsumerRegistionWith(consumerDataWithBlankName, "User's name cannot be blank")
    })

    it('cannot register a new consumer with a name containing only spaces', async () => {
        const consumerDataWithBlankName = {...kentRegistrationData, name: ' '}

        await expectToFailConsumerRegistionWith(consumerDataWithBlankName, "User's name cannot be blank")
    })

    it('cannot register a new consumer with a password of less than 6 characters', async () => {
        const consumerDataWithInvalidPassword = {...kentRegistrationData, password: '12345'}

        await expectToFailConsumerRegistionWith(consumerDataWithInvalidPassword, 'Password must have at least 6 characters and no empty spaces')
    })

    it('cannot register a new consumer with a password containing an empty space', async () => {
        const consumerDataWithInvalidPassword = {...kentRegistrationData, password: 'pass word'}

        await expectToFailConsumerRegistionWith(consumerDataWithInvalidPassword, 'Password must have at least 6 characters and no empty spaces')
    })

    it('cannot register a new consumer with an invalid email', async () => {
        await expect(userService.registerConsumer({...kentRegistrationData, email: '@domain.com'})).rejects.toThrow('Invalid email')
        await expect(userService.registerConsumer({...kentRegistrationData, email: 'user@.com'})).rejects.toThrow('Invalid email')
        await expect(userService.registerConsumer({...kentRegistrationData, email: 'user@domain'})).rejects.toThrow('Invalid email')
        await expect(userService.registerConsumer({...kentRegistrationData, email: 'user'})).rejects.toThrow('Invalid email')

        expect(await userService.existsUserWithEmail(kentRegistrationData.email)).toBe(false)
    })

    async function expectToFailConsumerRegistionWith(consumerRegistrationData, expectedErrorMessage) {
        await expect(
            userService.registerConsumer(consumerRegistrationData)
        ).rejects.toThrow(expectedErrorMessage)

        expect(await userService.existsUserWithEmail(consumerRegistrationData.email)).toBe(false)
    }
})