const { createServices } = require('../../src/model/serviceFactory')

const { createPizzeriaRegistrationData } = require('../testObjects')
const { createConsumerRegistrationData } = require('../testObjects')

describe('Find Pizzerias matching partial name', () => {
    let userService

    let kentuckyPizzeriaData
    let kePizzaPizzeriaData
    let muchaPizzaPizzeriaData

    beforeEach(() => {
        const services = createServices()
        userService = services.userService

        kentuckyPizzeriaData = createPizzeriaRegistrationData({name: 'Kentucky'})
        kePizzaPizzeriaData = createPizzeriaRegistrationData({name: 'Ke Pizza'})
        muchaPizzaPizzeriaData = createPizzeriaRegistrationData({name: 'Mucha Pizza'})
    })

    it('can find pizzerias matching a partial name', async () => {
        await userService.registerPizzeria(kentuckyPizzeriaData)
        await userService.registerPizzeria(kePizzaPizzeriaData)
        await userService.registerPizzeria(muchaPizzaPizzeriaData)

        const foundPizzerias = await userService.findPizzeriasByPartialName('Ke')

        expect(foundPizzerias).toHaveLength(2)
        expect(foundPizzerias[0].isNamed(kentuckyPizzeriaData.name)).toBe(true)
        expect(foundPizzerias[1].isNamed(kePizzaPizzeriaData.name)).toBe(true)
    })

    it('finding pizzerias matching a partial name is case insensitive', async () => {
        await userService.registerPizzeria(kentuckyPizzeriaData)
        await userService.registerPizzeria(kePizzaPizzeriaData)
        await userService.registerPizzeria(muchaPizzaPizzeriaData)

        const foundPizzerias = await userService.findPizzeriasByPartialName('kE')

        expect(foundPizzerias).toHaveLength(2)
        expect(foundPizzerias[0].isNamed(kentuckyPizzeriaData.name)).toBe(true)
        expect(foundPizzerias[1].isNamed(kePizzaPizzeriaData.name)).toBe(true)
    })

    it('finding pizzerias matching a partial name ignore consumers', async () => {
        const kentConsumerData = createConsumerRegistrationData({name: 'Kent'})
        await userService.registerConsumer(kentConsumerData)

        const foundPizzerias = await userService.findPizzeriasByPartialName('K')

        expect(foundPizzerias).toHaveLength(0)
    })

})