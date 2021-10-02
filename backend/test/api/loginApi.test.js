const request = require('supertest')
const {createApp} = require('../../src/api/app')
const {registerPath, loginPath} = require("../../src/api/path")
const {OK, BAD_REQUEST, NOT_FOUND} = require("../../src/api/statusCode")

const {bancheroRegistrationData} = require('../testObjects').pizzeriasRegistrationData
const {kentRegistrationData} = require('../testObjects').consumersRegistrationData

describe('Api login', () => {
    let requester

    beforeEach(async () => {
        requester = request(createApp())
    })

    it('can login a registered pizzeria with valid email and password', async () => {
        await requester.post(registerPath).send({...bancheroRegistrationData, rol: 'pizzeria'})

        const response = await requester.post(loginPath).send({
            email: bancheroRegistrationData.email,
            password: bancheroRegistrationData.password
        })

        expect(response.status).toBe(OK)
        expect(response.body).toEqual({
            email: bancheroRegistrationData.email,
            rol: 'pizzeria'
        })
    })

    it('can login a registered consumer with valid email and password', async () => {
        await requester.post(registerPath).send({...kentRegistrationData, rol: 'consumer'})

        const response = await requester.post(loginPath).send({
            email: kentRegistrationData.email,
            password: kentRegistrationData.password
        })

        expect(response.status).toBe(OK)
        expect(response.body).toEqual({
            email: kentRegistrationData.email,
            rol: 'consumer'
        })
    })

    it('cannot login with invalid email', async () => {
        await requester.post(registerPath).send({...bancheroRegistrationData, rol: 'pizzeria'})

        const response = await requester.post(loginPath).send({
            email: 'invalid email',
            password: bancheroRegistrationData.password
        })

        expect(response.status).toBe(NOT_FOUND)
        expect(response.body).toEqual({
            error: 'Invalid email or password'
        })
    })

    it('cannot login if the email is not of string type', async () => {
        await requester.post(registerPath).send({...bancheroRegistrationData, rol: 'pizzeria'})

        const response = await requester.post(loginPath).send({
            email: 1234,
            password: bancheroRegistrationData.password
        })

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"email" must be a string'
        })
    })

    it('cannot login if the password is not of string type', async () => {
        await requester.post(registerPath).send({...bancheroRegistrationData, rol: 'pizzeria'})

        const response = await requester.post(loginPath).send({
            email: bancheroRegistrationData.email,
            password: 1234
        })

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"password" must be a string'
        })
    })

    it('cannot login if a email is not provided', async () => {
        await requester.post(registerPath).send({...bancheroRegistrationData, rol: 'pizzeria'})

        const response = await requester.post(loginPath).send({
            password: bancheroRegistrationData.password
        })

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"email" is required'
        })
    })

    it('cannot login if a password is not provided', async () => {
        await requester.post(registerPath).send({...bancheroRegistrationData, rol: 'pizzeria'})

        const response = await requester.post(loginPath).send({
            email: bancheroRegistrationData.email
        })

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"password" is required'
        })
    })

})