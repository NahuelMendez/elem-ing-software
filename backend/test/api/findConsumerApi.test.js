const request = require('supertest')
const {createApp} = require('../../src/api/app')
const {OK, NOT_FOUND} = require("../../src/api/statusCode")
const testObjects = require('../testObjects')

const { kentRegistrationData } = testObjects.consumersRegistrationData
const { bancheroRegistrationData } = testObjects.pizzeriasRegistrationData

const {
    registerUser,
    getConsumer
} = require('../helpers/apiHelperFunctions')

describe('Api find consumer', () => {
    let requester

    beforeEach(async () => {
        requester = request(createApp())
    })

    it("can find a consumer by name when it's registered", async () => {
        await registerUser(requester, kentRegistrationData)
        
        const response = await getConsumer(requester, kentRegistrationData)

        expect(response.status).toBe(OK)
        expect(response.body).toEqual({
            username: kentRegistrationData.name,
            telephone: kentRegistrationData.telephone,
            email: kentRegistrationData.email
        })
    })

    it("cannot find consumer by name when it's not registered", async () => {
        const response = await getConsumer(requester, kentRegistrationData)

        expect(response.status).toBe(NOT_FOUND)
        expect(response.body).toEqual({
            error: `Consumer ${kentRegistrationData.name} not found`
        })
    })

    it("cannot find consumer by name for a registered pizzeria name", async () => {
        await registerUser(requester, bancheroRegistrationData)

        const response = await getConsumer(requester, bancheroRegistrationData)

        expect(response.status).toBe(NOT_FOUND)
        expect(response.body).toEqual({
            error: `Consumer ${bancheroRegistrationData.name} not found`
        })
    })

})

