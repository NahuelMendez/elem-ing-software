const request = require('supertest')
const {registerPath} = require("../../src/api/path")
const { createPizzeriaPath } = require('../helpers/pathFactory')
const {createApp} = require('../../src/api/app')
const {OK, NOT_FOUND} = require("../../src/api/statusCode")

const {
    bancheroRegistrationData
} = require('../testObjects').pizzeriasRegistrationData

describe('Api find Pizzeria', () => {
    let requester

    beforeEach(async () => {
        requester = request(createApp())
    })

    it("can find pizzeria by name when it's registered", async () => {
        await requester.post(registerPath).send({...bancheroRegistrationData, rol: 'pizzeria'})

        const response = await requester.get(createPizzeriaPath(bancheroRegistrationData.name))

        expect(response.status).toBe(OK)
        expect(response.body).toEqual({
            username: bancheroRegistrationData.name,
            telephone: bancheroRegistrationData.telephone,
            email: bancheroRegistrationData.email
        })
    })
})

