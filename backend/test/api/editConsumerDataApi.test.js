const request = require('supertest')
const {createApp} = require('../../src/api/app')
const testObjects = require('../testObjects')
const {OK, BAD_REQUEST, FORBIDDEN} = require("../../src/api/statusCode")

const { kentRegistrationData, martinRegistrationData } = testObjects.consumersRegistrationData
const { bancheroRegistrationData } = testObjects.pizzeriasRegistrationData

const { loginToken, editConsumerData, registerUser } = require('../helpers/apiHelperFunctions')

describe('Api consumer data edition', () => {
    let requester
    let tokenConsumer

    beforeEach(async () => {
        requester = request(createApp())
        tokenConsumer = await loginToken(requester, kentRegistrationData)
    })

    it(`can edit consumer data with valid data`, async () => {
        const newConsumerData = {...kentRegistrationData, name: 'kent', email: 'kent-beck@gmail.com',telephone: 1122334455}

        const response = await editConsumerData(requester, newConsumerData, tokenConsumer)

        expect(response.status).toBe(OK)
        expect(response.body).toEqual('the data was successfully modified')
    })

    it ('cannot edit consumer data when the new email is associated with another user', async () => {
        await registerUser(requester, martinRegistrationData)

        const newConsumerData = {...kentRegistrationData,email: martinRegistrationData.email}

        const response = await editConsumerData(requester, newConsumerData, tokenConsumer)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: `A user with email ${martinRegistrationData.email} is already registered`
        })
    })

    it ('cannot edit consumer data when name is blank', async () => {
        const newConsumerData = {...kentRegistrationData, name: ' '}

        const response = await editConsumerData(requester, newConsumerData, tokenConsumer)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: "User's name cannot be blank"
        })
    })

    it ('cannot edit consumer data when name is blank', async () => {
        const newConsumerData = {...kentRegistrationData, name: ' '}

        const response = await editConsumerData(requester, newConsumerData, tokenConsumer)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: "User's name cannot be blank"
        })
    })

    it('cannot edit consumer data for a unauthorized consumer', async () => {
        const tokenPizzeria = loginToken(requester, bancheroRegistrationData)

        const response = await editConsumerData(requester, kentRegistrationData, tokenPizzeria)

        expect(response.status).toBe(FORBIDDEN)
        expect(response.body).toEqual({
            error: 'invalid token or unauthorized user'
        })
    })

})