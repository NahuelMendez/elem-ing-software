const request = require('supertest')
const {createApp} = require('../../src/api/app')
const {registerPath} = require("../../src/api/path")
const { createMenuPath } = require('../helpers/pathFactory')
const {BAD_REQUEST, OK} = require("../../src/api/statusCode")
const testObjects = require('../testObjects')

const { bancheroRegistrationData, guerrinRegistrationData } = testObjects.pizzeriasRegistrationData
const { mozzarella, bacon } = testObjects.productsData

describe('Api menu creation', () => {
    let requester

    beforeEach(async () => {
        requester = request(createApp())
    })

    it(`a registered pizzeria can add a product to it's menu`, async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)

        const response = await requester
            .put(createMenuPath(bancheroRegistrationData.name))
            .send(mozzarella)

        expect(response.status).toBe(OK)
        expect(response.body).toEqual(mozzarella)
    })

    it('cannot add a product for a not registered pizzeria', async () => {
        const response = await requester
            .put(createMenuPath(guerrinRegistrationData.name))
            .send(mozzarella)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: `Pizzeria ${guerrinRegistrationData.name} not found`
        })
    })

    it('cannot add a product if the name is not of type string', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)

        const badPizza = { ...mozzarella, name: 123 }

        const response = await sendRequestPutMenuCreation(requester, badPizza)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product name" must be a string'
        })
    })

    it('cannot add a product if the description is not of type string', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)

        const badPizza = { ...mozzarella, description: 123 }

        const response = await sendRequestPutMenuCreation(requester, badPizza)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product description" must be a string'
        })
    })

    it('cannot add a product if the price is not of type number', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)

        const badPizza = { ...mozzarella, price: 'not a number' }

        const response = await sendRequestPutMenuCreation(requester, badPizza)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product price" must be a number'
        })
    })

    it('cannot add a product if the imageURL is not of type String', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)

        const badPizza = { ...mozzarella, imageURL: 123 }

        const response = await sendRequestPutMenuCreation(requester, badPizza)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product imageURL" must be a string'
        })
    })

    it('cannot add a product if a name is not provided', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)

        const badPizza = { ...mozzarella, name: undefined }

        const response = await sendRequestPutMenuCreation(requester, badPizza)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product name" is required'
        })
    })

    it('cannot add a product if a imageURL is not provided', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)

        const badPizza = { ...mozzarella, imageURL: undefined }

        const response = await sendRequestPutMenuCreation(requester, badPizza)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product imageURL" is required'
        })
    })

    it('cannot add a product if a price is not provided', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)

        const badPizza = { ...mozzarella, price: undefined }

        const response = await sendRequestPutMenuCreation(requester, badPizza)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product price" is required'
        })
    })

})

async function sendRequestPutMenuCreation(requester, badPizza) {
    return await requester
        .put(createMenuPath(bancheroRegistrationData.name))
        .send(badPizza)
}
