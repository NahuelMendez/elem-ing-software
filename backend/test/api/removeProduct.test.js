const request = require('supertest')
const {createApp} = require('../../src/api/app')
const {registerPath, menuPath} = require("../../src/api/path")
const { createMenuPath } = require('../helpers/pathFactory')
const {BAD_REQUEST, OK} = require("../../src/api/statusCode")
const testObjects = require('../testObjects')

const { bancheroRegistrationData, guerrinRegistrationData } = testObjects.pizzeriasRegistrationData
const { mozzarella, bacon } = testObjects.productsData

describe('Api remove product from menu', () => {
    let requester

    beforeEach(async () => {
        requester = request(createApp())
    })

    it(`given a registered pizzeria when a product is removed from it's menu the product is no longer on it's menu`, async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)
        await requester.put(createMenuPath(bancheroRegistrationData.name)).send(mozzarella)

        await requester.delete(createMenuPath(bancheroRegistrationData.name)).send({productName: mozzarella.name})

        const getMenuResponse = await requester.get(createMenuPath(bancheroRegistrationData.name))
        await expect(getMenuResponse.body).toEqual([])
    })

    it(`given a registered pizzeria when a product is removed from it's menu the response has the removed product name`, async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)
        await requester.put(createMenuPath(bancheroRegistrationData.name)).send(mozzarella)

        const response = await requester.delete(createMenuPath(bancheroRegistrationData.name)).send({productName: mozzarella.name})

        expect(response.status).toBe(OK)
        expect(response.body).toEqual({removed: mozzarella.name})
    })

    

})

async function sendRequestPutMenuCreation(requester, badPizza) {
    return await requester
        .put(createMenuPath(bancheroRegistrationData.name))
        .send(badPizza)
}
