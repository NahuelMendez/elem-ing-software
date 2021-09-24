const request = require('supertest')
const {registerPath} = require("../src/api/path")
const {app} = require('../src/api/app')

const {
    bancheroRegistrationData,
    guerrinRegistrationData
} = require('./testObjects').pizzeriasRegistrationData

describe('API', () => {
    let requester

    beforeEach(async () => {

        requester = request(app)
    })

    it('can register a new pizzeria with valid registration data', async () => {
        const response = await requester.post(registerPath).send(bancheroRegistrationData)

        expect(response.status).toBe(201)
        expect(response.body).toEqual({
            name: bancheroRegistrationData.name
        })
    })

    it('cannot register a new pizzeria with invalid registration data', async () => {
        const response = await requester.post(registerPath).send({...bancheroRegistrationData, name: ''})

        expect(response.status).toBe(404)
        expect(response.body).toEqual({
            error: "Pizzeria's name cannot be blank"
        })
    })

    it('cannot register a new pizzeria with a repeated pizzeria name', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)
    
        const pizzeriaDataWithRepeatedName = {
            ...guerrinRegistrationData,
            name: bancheroRegistrationData.name
        }

        const response = await requester.post(registerPath).send(pizzeriaDataWithRepeatedName)

        expect(response.status).toBe(404)
        expect(response.body).toEqual({
            error: `Pizzeria name ${pizzeriaDataWithRepeatedName.name} already registered`
        })
    })

    afterAll(() => {
        
    })

})