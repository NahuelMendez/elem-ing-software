const request = require('supertest')
const {createApp} = require('../../src/api/app')
const {createMenuCreatePath, registerPath} = require("../../src/api/path")
const testObjects = require('../testObjects')

const { bancheroRegistrationData, guerrinRegistrationData } = testObjects.pizzeriasRegistrationData
const { mozzarella, bacon } = testObjects.productsData

describe('Api registration', () => {
    let requester

    beforeEach(async () => {
        requester = request(createApp())
    })

    it('a registered pizzeria can create a menu', async () => {
        await requester.post(registerPath).send(bancheroRegistrationData)

        const response = await requester
            .put(createMenuCreatePath(bancheroRegistrationData.name))
            .send({menu: [mozzarella, bacon]})

        expect(response.status).toBe(201)
        expect(response.body).toEqual({
            message: 'successful operation'
        })
    })

    it('cannot create a menu for a not registered pizzeria', async () => {
        const response = await requester
            .put(createMenuCreatePath(guerrinRegistrationData.name))
            .send({menu: [mozzarella, bacon]})

        expect(response.status).toBe(400)
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

        const response = await requester
            .put(createMenuCreatePath(bancheroRegistrationData.name))
            .send({menu: [mozzarella, bacon, badPizza]})

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: '"[2].name" must be a string'
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

        const response = await requester
            .put(createMenuCreatePath(bancheroRegistrationData.name))
            .send({menu: [mozzarella, bacon, badPizza]})

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: '"[2].description" must be a string'
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

        const response = await requester
            .put(createMenuCreatePath(bancheroRegistrationData.name))
            .send({menu: [mozzarella, bacon, badPizza]})

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: '"[2].price" must be a number'
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

        const response = await requester
            .put(createMenuCreatePath(bancheroRegistrationData.name))
            .send({menu: [mozzarella, bacon, badPizza]})

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: '"[2].imageURL" must be a string'
        })
    })

})