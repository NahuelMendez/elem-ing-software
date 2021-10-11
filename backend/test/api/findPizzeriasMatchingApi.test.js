const request = require('supertest')
const { createSearchPizzeriaPath } = require('../helpers/pathFactory')
const {createApp} = require('../../src/api/app')
const {OK} = require("../../src/api/statusCode")

const { createPizzeriaRegistrationAPIData } = require('../testObjects')

const {
    registerUser
} = require('../helpers/apiHelperFunctions')

describe('Api find Pizzeria matching partial name', () => {
    let requester

    let kentuckyPizzeriaData
    let kePizzaPizzeriaData
    let muchaPizzaPizzeriaData

    beforeEach(async () => {
        requester = request(createApp())

        kentuckyPizzeriaData = createPizzeriaRegistrationAPIData({name: 'Kentucky'})
        kePizzaPizzeriaData = createPizzeriaRegistrationAPIData({name: 'Ke Pizza'})
        muchaPizzaPizzeriaData = createPizzeriaRegistrationAPIData({name: 'Mucha Pizza'})
    })

    it('can find pizzerias matching a partial name', async () => {
        await registerUser(requester, {...kentuckyPizzeriaData, rol: 'pizzeria'})
        await registerUser(requester, {...kePizzaPizzeriaData, rol: 'pizzeria'})
        await registerUser(requester, {...muchaPizzaPizzeriaData, rol: 'pizzeria'})

        const response = await requester.get(createSearchPizzeriaPath('Ke'))
        
        expect(response.status).toBe(OK)
        expect(response.body).toHaveLength(2)
        expect(response.body[0].name).toEqual(kentuckyPizzeriaData.name)
        expect(response.body[1].name).toEqual(kePizzaPizzeriaData.name)
    })

    it('finding pizzerias matching a partial name is case insensitive', async () => {
        await registerUser(requester, {...kentuckyPizzeriaData, rol: 'pizzeria'})
        await registerUser(requester, {...kePizzaPizzeriaData, rol: 'pizzeria'})
        await registerUser(requester, {...muchaPizzaPizzeriaData, rol: 'pizzeria'})

        const response = await requester.get(createSearchPizzeriaPath('kE'))
        
        expect(response.status).toBe(OK)
        expect(response.body).toHaveLength(2)
        expect(response.body[0].name).toEqual(kentuckyPizzeriaData.name)
        expect(response.body[1].name).toEqual(kePizzaPizzeriaData.name)
    })

})