const request = require('supertest')
const {createApp} = require('../../src/api/app')
const {CREATED, BAD_REQUEST} = require("../../src/api/statusCode")

const {
    bancheroRegistrationData,
    guerrinRegistrationData
} = require('../testObjects').pizzeriasRegistrationData

const {
    kentRegistrationData
} = require('../testObjects').consumersRegistrationData

const { registerUser } = require('../helpers/apiHelperFunctions')

describe('Api pizzeria registration', () => {
    let requester

    beforeEach(async () => {
        requester = request(createApp())
    })

    it('can register a new pizzeria with valid registration data', async () => {
        const response = await registerUser(requester, bancheroRegistrationData)

        expect(response.status).toBe(CREATED)
        expect(response.body).toEqual({
            name: bancheroRegistrationData.name,
            rol: 'pizzeria'
        })
    })

    it('cannot register a new pizzeria with an empty name', async () => {
        const response = await registerUser(requester, {...bancheroRegistrationData, name: ''})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"name" is not allowed to be empty'
        })
    })

    it('cannot register a new pizzeria with a repeated pizzeria name', async () => {
        await registerUser(requester, bancheroRegistrationData)
    
        const pizzeriaDataWithRepeatedName = {
            ...guerrinRegistrationData,
            name: bancheroRegistrationData.name
        }

        const response = await registerUser(requester,pizzeriaDataWithRepeatedName)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: `Pizzeria name ${pizzeriaDataWithRepeatedName.name} already registered`
        })
    })

    it('cannot register a new pizzeria if the name is not of type string', async () => {
        const response = await registerUser(requester, {...bancheroRegistrationData, name: 123})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"name" must be a string'
        })
    })

    it('cannot register a new pizzeria if the email is not of type string ', async () => {
        const response = await registerUser(requester, {...bancheroRegistrationData, email: 123})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"email" must be a string'
        })
    })

    it('cannot register a new pizzeria if the password is not of type string ', async () => {
        const response = await registerUser(requester, {...bancheroRegistrationData, password: 123})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"password" must be a string'
        })
    })

    it('cannot register a new pizzeria if a password is not provided', async () => {
        const response = await registerUser(requester, {...bancheroRegistrationData, password: undefined})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"password" is required'
        })
    })

    it('cannot register a new pizzeria if a email is not provided', async () => {
        const response = await registerUser(requester, {...bancheroRegistrationData, email: undefined})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"email" is required'
        })
    })

    it('cannot register a new pizzeria if a name is not provided', async () => {
        const response = await registerUser(requester, {...bancheroRegistrationData, name: undefined})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"name" is required'
        })
    })

    it('cannot register a new pizzeria if a telephone is not provided', async () => {
        const response = await registerUser(requester, {...bancheroRegistrationData, telephone: undefined})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"telephone" is required'
        })
    })

    it('cannot register a new pizzeria if a rol is not provided', async () => {
        const response = await registerUser(requester, {...bancheroRegistrationData, rol: undefined})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"rol" is required'
        })
    })

    it('cannot register a user with an invalid rol', async () => {
        const response = await registerUser(requester, {...bancheroRegistrationData, rol: 'invalid_rol'})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: `"rol" must be one of [consumer, pizzeria]`
        })
    })

})