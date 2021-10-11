const request = require('supertest')
const {createApp} = require('../../src/api/app')
const {CREATED, BAD_REQUEST} = require("../../src/api/statusCode")

const {
    kentRegistrationData,
    martinRegistrationData
} = require('../testObjects').consumersRegistrationData

const { registerUser } = require('../helpers/apiHelperFunctions')

describe('Api consumer registration', () => {
    let requester

    beforeEach(async () => {
        requester = request(createApp())
    })

    it('can register a new consumer with valid registration data', async () => {
        const response = await registerUser(requester, kentRegistrationData)

        expect(response.status).toBe(CREATED)
        expect(response.body).toEqual({
            name: kentRegistrationData.name,
            rol: 'consumer'
        })
    })

    it('cannot register a new consumer with a repeated email', async () => {
        await registerUser(requester, kentRegistrationData)

        const consumerDataWithRepeatedName = {
            ...martinRegistrationData,
            email: kentRegistrationData.email
        }

        const response = await registerUser(requester, consumerDataWithRepeatedName)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: `A user with email ${kentRegistrationData.email} is already registered`
        })
    })

    it('cannot register a new consumer with an empty name', async () => {
        const response = await registerUser(requester, {...martinRegistrationData, name: ''})
        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"name" is not allowed to be empty'
        })
    })

    it('cannot register a new consumer if the name is not of type string', async () => {
        const response = await registerUser(requester, {...kentRegistrationData, name: 123})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"name" must be a string'
        })
    })

    it('cannot register a new consumer if the email is not of type string', async () => {
        const response = await registerUser(requester, {...kentRegistrationData, email: 123})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"email" must be a string'
        })
    })

    it('cannot register a new consumer if the password is not of type string', async () => {
        const response = await registerUser(requester, {...kentRegistrationData, password: 123})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"password" must be a string'
        })
    })

    it('cannot register a new consumer if a password is not provided', async () => {
        const response = await registerUser(requester,{...kentRegistrationData, password: undefined})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"password" is required'
        })
    })

    it('cannot register a new consumer if a email is not provided', async () => {
        const response = await registerUser(requester,{...kentRegistrationData, email: undefined})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"email" is required'
        })
    })

    it('cannot register a new consumer if a name is not provided', async () => {
        const response = await registerUser(requester,{...kentRegistrationData, name: undefined})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"name" is required'
        })
    })

    it('cannot register a new consumer if a telephone is not provided', async () => {
        const response = await registerUser(requester,{...kentRegistrationData, telephone: undefined})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"telephone" is required'
        })
    })

})