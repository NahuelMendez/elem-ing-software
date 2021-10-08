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

    it(`a registered pizzeria can remove one product from it's menu`, async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)
        await requester.put(createMenuPath(bancheroRegistrationData.name)).send(mozzarella)

        await requester.delete(createMenuPath(bancheroRegistrationData.name)).send({productName: mozzarella.name})

        const getMenuResponse = await requester.get(createMenuPath(bancheroRegistrationData.name))
        await expect(getMenuResponse.body).toEqual([])
    })

    

})

async function sendRequestPutMenuCreation(requester, badPizza) {
    return await requester
        .put(createMenuPath(bancheroRegistrationData.name))
        .send(badPizza)
}
