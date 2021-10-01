const request = require('supertest')
const {registerPath} = require("../../src/api/path")
const {createApp} = require('../../src/api/app')
const {CREATED, BAD_REQUEST} = require("../../src/api/statusCode")

const {
    bancheroRegistrationData,
    guerrinRegistrationData
} = require('../testObjects').pizzeriasRegistrationData

describe('Api registration', () => {
    let requester

    beforeEach(async () => {
        requester = request(createApp())
    })

    it('can register a new pizzeria with valid registration data', async () => {
        const response = await requester.post(registerPath).send(bancheroRegistrationData)

        expect(response.status).toBe(CREATED)
        expect(response.body).toEqual({
            name: bancheroRegistrationData.name
        })
    })

    it('cannot register a new pizzeria with an empty name', async () => {
        const response = await requester.post(registerPath).send({...bancheroRegistrationData, name: ''})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"name" is not allowed to be empty'
        })
    })

    it('cannot register a new pizzeria with a repeated pizzeria name', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)
    
        const pizzeriaDataWithRepeatedName = {
            ...guerrinRegistrationData,
            name: bancheroRegistrationData.name
        }

        const response = await requester.post(registerPath).send(pizzeriaDataWithRepeatedName)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: `Pizzeria name ${pizzeriaDataWithRepeatedName.name} already registered`
        })
    })

    it('cannot register a new pizzeria if the name is not of string type', async () => {
        const response = await requester.post(registerPath).send({...bancheroRegistrationData, name: 123})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"name" must be a string'
        })
    })

    it('cannot register a new pizzeria if the email is not of string type', async () => {
        const response = await requester.post(registerPath).send({...bancheroRegistrationData, email: 123})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"email" must be a string'
        })
    })

    it('cannot register a new pizzeria if the password is not of string type', async () => {
        const response = await requester.post(registerPath).send({...bancheroRegistrationData, password: 123})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"password" must be a string'
        })
    })

    it('cannot register a new pizzeria if a password is not provided', async () => {
        const response = await requester.post(registerPath).send({
            name: 'Barquito',
            telephone: 1112345678,
            email: 'barquito@gmail.com'
        })

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"password" is required'
        })
    })

    it('cannot register a new pizzeria if a email is not provided', async () => {
        const response = await requester.post(registerPath).send({
            name: 'Barquito',
            telephone: 1112345678,
            password: 'password'
        })

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"email" is required'
        })
    })

    it('cannot register a new pizzeria if a name is not provided', async () => {
        const response = await requester.post(registerPath).send({
            telephone: 1112345678,
            email: 'barquito@gmail.com',
            password: 'password'
        })

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"name" is required'
        })
    })

    it('cannot register a new pizzeria if a telephone is not provided', async () => {
        const response = await requester.post(registerPath).send({
            name: 'Barquito',
            email: 'barquito@gmail.com',
            password: 'password'
        })

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"telephone" is required'
        })
    })

})