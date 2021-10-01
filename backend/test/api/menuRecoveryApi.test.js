const request = require('supertest')
const {createApp} = require('../../src/api/app')
const {registerPath} = require("../../src/api/path")
const { createMenuPath } = require('../helpers/pathFactory')
const {OK, NOT_FOUND} = require("../../src/api/statusCode")
const testObjects = require('../testObjects')

const {bancheroRegistrationData, guerrinRegistrationData} = testObjects.pizzeriasRegistrationData
const { mozzarella, bacon } = testObjects.productsData

describe('Api menu recovery', () => {
    let requester

    beforeEach(async () => {
        requester = request(createApp())
    })

    it('get the empty menu of a registered pizzeria', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)

        const response = await requester.get(createMenuPath(bancheroRegistrationData.name))

        expect(response.status).toBe(OK)
        expect(response.body).toEqual([])
    })

    it('get the menu of a registered pizzeria with added products', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)
        await requester
            .put(createMenuPath(bancheroRegistrationData.name))
            .send(mozzarella)

        const response = await requester.get(createMenuPath(bancheroRegistrationData.name))

        expect(response.status).toBe(OK)
        expect(response.body).toEqual([mozzarella])
    })

    it('get the menu of a unregistered pizzeria', async () => {
        const response = await requester.get(createMenuPath(guerrinRegistrationData.name))

        expect(response.status).toBe(NOT_FOUND)
        expect(response.body).toEqual({
            error: `Pizzeria ${guerrinRegistrationData.name} not found`
        })
    })
})