const request = require('supertest')
const {createApp} = require('../../src/api/app')
const { createMenuPath } = require('../helpers/pathFactory')
const {OK, NOT_FOUND} = require("../../src/api/statusCode")
const testObjects = require('../testObjects')

const {bancheroRegistrationData, guerrinRegistrationData} = testObjects.pizzeriasRegistrationData
const { mozzarella} = testObjects.productsData
const { registerUser, getMenu, loginToken } = require('../helpers/apiHelperFunctions')

describe('Api menu recovery', () => {
    let requester

    beforeEach(async () => {
        requester = request(createApp())
    })

    it('get the empty menu of a registered pizzeria', async () => {
        await registerUser(requester, bancheroRegistrationData)

        const response = await getMenu(requester, bancheroRegistrationData)

        expect(response.status).toBe(OK)
        expect(response.body).toEqual([])
    })

    it('get the menu of a registered pizzeria with added products', async () => {
        const token = await loginToken(requester, bancheroRegistrationData)
        
        await requester
            .put(createMenuPath(bancheroRegistrationData.name))
            .send(mozzarella)
            .set('Authorization', token)

        const response = await requester.get(createMenuPath(bancheroRegistrationData.name))

        expect(response.status).toBe(OK)
        expect(response.body).toEqual([mozzarella])
    })

    it('get the menu of a unregistered pizzeria', async () => {
        const response = await getMenu(requester, guerrinRegistrationData)

        expect(response.status).toBe(NOT_FOUND)
        expect(response.body).toEqual({
            error: `Pizzeria ${guerrinRegistrationData.name} not found`
        })
    })
})