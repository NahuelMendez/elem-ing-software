const request = require('supertest')
const {createApp} = require('../../src/api/app')
const {registerPath, loginPath} = require("../../src/api/path")

const {bancheroRegistrationData} = require('../testObjects').pizzeriasRegistrationData

describe('Api login', () => {
    let requester

    beforeEach(async () => {
        requester = request(createApp())
    })

    it('can login a registered pizzeria with valid username and password', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)

        const response = await requester.post(loginPath).send({
            username: bancheroRegistrationData.name,
            password: bancheroRegistrationData.password
        })

        expect(response.status).toBe(201)
        expect(response.body).toEqual({
            username: bancheroRegistrationData.name
        })
    })

    it('cannot login with invalid username', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)

        const response = await requester.post(loginPath).send({
            username: 'invalid username',
            password: bancheroRegistrationData.password
        })

        expect(response.status).toBe(404)
        expect(response.body).toEqual({
            error: 'Invalid username or password'
        })
    })

    it('cannot login if the username is not of string type', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)

        const response = await requester.post(loginPath).send({
            username: 1234,
            password: bancheroRegistrationData.password
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: '"username" must be a string'
        })
    })

    it('cannot login if the password is not of string type', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)

        const response = await requester.post(loginPath).send({
            username: bancheroRegistrationData.name,
            password: 1234
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: '"password" must be a string'
        })
    })

    it('cannot login if a username is not provided', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)

        const response = await requester.post(loginPath).send({
            password: bancheroRegistrationData.password
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: '"username" is required'
        })
    })

    it('cannot login if a password is not provided', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)

        const response = await requester.post(loginPath).send({
            username: bancheroRegistrationData.name
        })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: '"password" is required'
        })
    })

})