const request = require('supertest')
const {registerPath} = require("../../src/api/path")
const {createApp} = require('../../src/api/app')
const {CREATED, BAD_REQUEST} = require("../../src/api/statusCode")

const {
    kentRegistrationData,
    martinRegistrationData
} = require('../testObjects').consumersRegistrationData

describe('Api consumer registration', () => {
    let requester

    beforeEach(async () => {
        requester = request(createApp())
    })

    it('can register a new consumer with valid registration data', async () => {
        const response = await requester.post(registerPath).send({...kentRegistrationData, rol: 'consumer'})

        expect(response.status).toBe(CREATED)
        expect(response.body).toEqual({
            name: kentRegistrationData.name,
            rol: 'consumer'
        })
    })

    it('cannot register a new consumer with a repeated email', async () => {
        await requester.post(registerPath).send({...kentRegistrationData, rol: 'consumer'})

        const consumerDataWithRepeatedName = {
            ...martinRegistrationData,
            email: kentRegistrationData.email
        }

        const response = await requester.post(registerPath).send({...consumerDataWithRepeatedName, rol: 'consumer'})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: `A user with email ${kentRegistrationData.email} is already registered`
        })
    })

    it('cannot register a new consumer with an empty name', async () => {
        const response = await requester.post(registerPath).send({...martinRegistrationData, name: '', rol: 'consumer'})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"name" is not allowed to be empty'
        })
    })

    it('cannot register a new consumer if the name is not of string type', async () => {
        const response = await requester.post(registerPath).send({...kentRegistrationData, name: 123, rol: 'consumer'})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"name" must be a string'
        })
    })

    it('cannot register a new consumer if the email is not of string type', async () => {
        const response = await requester.post(registerPath).send({...kentRegistrationData, email: 123, rol: 'consumer'})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"email" must be a string'
        })
    })

    it('cannot register a new consumer if the password is not of string type', async () => {
        const response = await requester.post(registerPath).send({...kentRegistrationData, password: 123, rol: 'consumer'})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"password" must be a string'
        })
    })

    it('cannot register a new consumer if a password is not provided', async () => {
        const response = await requester.post(registerPath).send({
            name: 'Kent Beck',
            telephone: 1112345678,
            email: 'kent@gmail.com',
            rol: 'consumer'
        })

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"password" is required'
        })
    })

    it('cannot register a new consumer if a email is not provided', async () => {
        const response = await requester.post(registerPath).send({
            name: 'Kent Beck',
            telephone: 1112345678,
            password: 'kent@gmail.com',
            rol: 'consumer'
        })

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"email" is required'
        })
    })

    it('cannot register a new consumer if a name is not provided', async () => {
        const response = await requester.post(registerPath).send({
            telephone: 1112345678,
            email: 'kent@gmail.com',
            password: 'password',
            rol: 'consumer'
        })

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"name" is required'
        })
    })

    it('cannot register a new consumer if a telephone is not provided', async () => {
        const response = await requester.post(registerPath).send({
            name: 'Kent Beck',
            email: 'kent@gmail.com',
            password: 'password',
            rol: 'consumer'
        })

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"telephone" is required'
        })
    })

})