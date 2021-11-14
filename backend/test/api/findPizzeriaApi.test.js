const request = require('supertest')
const {createApp} = require('../../src/api/app')
const {OK, NOT_FOUND} = require("../../src/api/statusCode")
const testObjects = require('../testObjects')

const { bancheroRegistrationData } = testObjects.pizzeriasRegistrationData
const { kentRegistrationData } = testObjects.consumersRegistrationData

const {
    registerUser,
    getPizzeria
} = require('../helpers/apiHelperFunctions')

describe('Api find Pizzeria', () => {
    let requester

    beforeEach(async () => {
        requester = request(createApp())
    })

    it("can find pizzeria by name when it's registered", async () => {
        await registerUser(requester, bancheroRegistrationData)
        
        const response = await getPizzeria(requester, bancheroRegistrationData)

        expect(response.status).toBe(OK)
        expect(response.body).toEqual({
            username: bancheroRegistrationData.name,
            telephone: bancheroRegistrationData.telephone,
            email: bancheroRegistrationData.email,
            address: bancheroRegistrationData.address
        })
    })

    it("cannot find pizzeria by name when it's not registered", async () => {
        const response = await getPizzeria(requester, bancheroRegistrationData)

        expect(response.status).toBe(NOT_FOUND)
        expect(response.body).toEqual({
            error: `Pizzeria ${bancheroRegistrationData.name} not found`
        })
    })

    it("cannot find pizzeria by name when is a consumer name", async () => {
        await registerUser(requester, kentRegistrationData)
        
        const response = await getPizzeria(requester, kentRegistrationData)

        expect(response.status).toBe(NOT_FOUND)
        expect(response.body).toEqual({
            error: `Pizzeria ${kentRegistrationData.name} not found`
        })
    })
})

