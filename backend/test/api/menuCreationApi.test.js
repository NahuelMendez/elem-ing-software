const request = require('supertest')
const {createApp} = require('../../src/api/app')
const {registerPath} = require("../../src/api/path")
const { createMenuPath } = require('../helpers/pathFactory')
const {CREATED, BAD_REQUEST} = require("../../src/api/statusCode")
const testObjects = require('../testObjects')

const { bancheroRegistrationData, guerrinRegistrationData } = testObjects.pizzeriasRegistrationData
const { mozzarella, bacon } = testObjects.productsData

describe('Api menu creation', () => {
    let requester

    beforeEach(async () => {
        requester = request(createApp())
    })

    it('a registered pizzeria can create a menu', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)

        const response = await requester
            .put(createMenuPath(bancheroRegistrationData.name))
            .send({menu: [mozzarella, bacon]})

        expect(response.status).toBe(CREATED)
        expect(response.body).toEqual({
            message: 'successful operation'
        })
    })

    it('cannot create a menu for a not registered pizzeria', async () => {
        const response = await requester
            .put(createMenuPath(guerrinRegistrationData.name))
            .send({menu: [mozzarella, bacon]})

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: `Pizzeria ${guerrinRegistrationData.name} not found`
        })
    })

    it('cannot register a new menu if the name is not of string type', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)

        const badPizza = {
            name : 123,
            description : 'bacon description',
            price : 1,
            imageURL : 'http://img.com/product.jpg'
        }

        const response = await sendRequestPutMenuCreation(requester, badPizza)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product name" must be a string'
        })
    })

    it('cannot register a new menu if the description is not of string type', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)

        const badPizza = {
            name : 'bad',
            description : 123,
            price : 1,
            imageURL : 'http://img.com/product.jpg'
        }

        const response = await sendRequestPutMenuCreation(requester, badPizza)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product description" must be a string'
        })
    })

    it('cannot register a new menu if the price is not of number type', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)

        const badPizza = {
            name : 'bad',
            description : 'bad description',
            price : 'sadasd',
            imageURL : 'http://img.com/product.jpg'
        }

        const response = await sendRequestPutMenuCreation(requester, badPizza)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product price" must be a number'
        })
    })

    it('cannot register a new menu if the imageURL is not of number type', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)

        const badPizza = {
            name : 'bad',
            description : 'bad description',
            price : 1,
            imageURL : 123
        }

        const response = await sendRequestPutMenuCreation(requester, badPizza)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product imageURL" must be a string'
        })
    })

    it('cannot register a new menu if a name is not provided', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)

        const badPizza = {
            description : 'bad description',
            price : 1,
            imageURL : 'http://img.com/product.jpg'
        }

        const response = await sendRequestPutMenuCreation(requester, badPizza)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product name" is required'
        })
    })

    it('cannot register a new menu if a imageURL is not provided', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)

        const badPizza = {
            name : 'bad',
            description : 'bad description',
            price : 1,
        }

        const response = await sendRequestPutMenuCreation(requester, badPizza)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product imageURL" is required'
        })
    })

    it('cannot register a new menu if a price is not provided', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)

        const badPizza = {
            name : 'bad',
            description : 'bad description',
            imageURL : 'http://img.com/product.jpg'
        }

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
        .send({ menu: [mozzarella, bacon, badPizza] })
}
