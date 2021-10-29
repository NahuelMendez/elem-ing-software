const request = require('supertest')
const {createApp} = require('../../src/api/app')
const testObjects = require('../testObjects')
const {OK, BAD_REQUEST} = require("../../src/api/statusCode")

const { kentRegistrationData, martinRegistrationData } = testObjects.consumersRegistrationData

const { loginToken, editConsumerData, registerUser } = require('../helpers/apiHelperFunctions')

describe('Api consumer data edition', () => {
    let requester

    beforeEach(async () => {
        requester = request(createApp())
    })

    it(`can edit consumer data with valid data`, async () => {
        const token = await loginToken(requester, kentRegistrationData)

        const newConsumerData = {...kentRegistrationData, name: 'kent', email: 'kent-beck@gmail.com',telephone: 1122334455}

        const response = await editConsumerData(requester, newConsumerData, token)

        expect(response.status).toBe(OK)
        expect(response.body).toEqual('the data was successfully modified')
    })

    it ('cannot edit consumer data when the new email is associated with another user', async () => {
        await registerUser(requester, martinRegistrationData)
        
        const token = await loginToken(requester, kentRegistrationData)

        const newConsumerData = {...kentRegistrationData,email: martinRegistrationData.email}

        const response = await editConsumerData(requester, newConsumerData, token)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: `A user with email ${martinRegistrationData.email} is already registered`
        })
    })

})