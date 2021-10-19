const request = require('supertest')
const {createApp} = require('../../src/api/app')
const {OK, NOT_FOUND} = require("../../src/api/statusCode")
const testObjects = require('../testObjects')

const { kentRegistrationData } = testObjects.consumersRegistrationData
const { bancheroRegistrationData } = testObjects.pizzeriasRegistrationData

const {
    loginToken
} = require('../helpers/apiHelperFunctions')


describe('Consumer profile API', () => {
    let requester

    beforeEach(async () => {
        requester = request(createApp())
    })

    it("an authenticated consumer can ask for his personal data", async () => {
        const token = await loginToken(requester, kentRegistrationData)

        const response = await requester.get('/api/consumer').send().set('Authorization', token)

        expect(response.status).toBe(OK)
        expect(response.body).toEqual({
            username: kentRegistrationData.name,
            telephone: kentRegistrationData.telephone,
            email: kentRegistrationData.email
        })
    })


})

