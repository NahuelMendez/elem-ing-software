const request = require('supertest')
const {createApp} = require('../../src/api/app')
const {OK, BAD_REQUEST, NOT_FOUND} = require("../../src/api/statusCode")

const {bancheroRegistrationData} = require('../testObjects').pizzeriasRegistrationData
const {kentRegistrationData} = require('../testObjects').consumersRegistrationData

const {
    login,
    registerUser
} = require('../helpers/apiHelperFunctions')

describe('Api login', () => {
    let requester

    beforeEach(async () => {
        requester = request(createApp())
    })

    it('can login a registered pizzeria with valid email and password', async () => {
        await registerUser(requester, bancheroRegistrationData)

        const response = await login(requester, {
            email: bancheroRegistrationData.email,
            password: bancheroRegistrationData.password
        })

        expect(response.status).toBe(OK)
        expect(response.body).toEqual({
            email: bancheroRegistrationData.email,
            username: bancheroRegistrationData.name,
            rol: bancheroRegistrationData.rol
        })
    })

    it('can login a registered consumer with valid email and password', async () => {
        await registerUser(requester, kentRegistrationData)

        const response = await login(requester, {
            email: kentRegistrationData.email,
            password: kentRegistrationData.password
        })

        expect(response.status).toBe(OK)
        expect(response.body).toEqual({
            email: kentRegistrationData.email,
            username: kentRegistrationData.name,
            rol: kentRegistrationData.rol
        })
    })

    it('cannot login with invalid email', async () => {
        await registerUser(requester, bancheroRegistrationData)

        const response = await login(requester, {
            email: 'invalid email',
            password: bancheroRegistrationData.password
        })

        expect(response.status).toBe(NOT_FOUND)
        expect(response.body).toEqual({
            error: 'Invalid email or password'
        })
    })

    it('cannot login if the email is not of type string', async () => {
        await registerUser(requester, bancheroRegistrationData)

        const response = await login(requester, {
            email: 1234,
            password: bancheroRegistrationData.password
        })

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"email" must be a string'
        })
    })

    it('cannot login if the password is not of type string', async () => {
        await registerUser(requester, bancheroRegistrationData)

        const response = await login(requester, {
            email: bancheroRegistrationData.email,
            password: 1234
        })

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"password" must be a string'
        })
    })

    it('cannot login if a email is not provided', async () => {
        await registerUser(requester, bancheroRegistrationData)

        const response = await login(requester, {
            password: bancheroRegistrationData.password
        })

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"email" is required'
        })
    })

    it('cannot login if a password is not provided', async () => {
        await registerUser(requester, bancheroRegistrationData)

        const response = await login(requester, {
            email: bancheroRegistrationData.email
        })

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"password" is required'
        })
    })

})