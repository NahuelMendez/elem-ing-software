const request = require('supertest')
const {createApp} = require('../../src/api/app')
const { createMenuPath } = require('../helpers/pathFactory')
const {BAD_REQUEST, OK, UNAUTHORIZED, FORBIDDEN} = require("../../src/api/statusCode")
const testObjects = require('../testObjects')

const { bancheroRegistrationData, guerrinRegistrationData } = testObjects.pizzeriasRegistrationData
const { mozzarella, bacon } = testObjects.productsData 
const { loginToken, addProduct } = require('../helpers/apiHelperFunctions')

describe('Api add product', () => {
    let requester

    beforeEach(async () => {
        requester = request(createApp())
    })

    it(`a registered pizzeria can add a product to it's menu`, async () => {
        const token = await loginToken(requester, bancheroRegistrationData)

        const response = await addProduct(requester, bancheroRegistrationData, mozzarella, token)

        expect(response.status).toBe(OK)
        expect(response.body).toEqual(mozzarella)
    })

    it("a pizzeria's menu cannot have products with repeated name", async () => {
        const token = await loginToken(requester, guerrinRegistrationData)

        await addProduct(requester, guerrinRegistrationData, mozzarella, token)
        
        const response = await addProduct(requester, guerrinRegistrationData, {...bacon, name: mozzarella.name}, token)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: 'A menu cannot have repeated product names'
        })
    })

    it('cannot add a product when the token is missing', async () => {
        const response = await requester
            .put(createMenuPath(guerrinRegistrationData.name))
            .send(mozzarella)

        expect(response.status).toBe(UNAUTHORIZED)
        expect(response.body).toEqual({
            error: 'token missing'
        })
    })

    it('cannot add a product for a unauthorized pizzeria', async () => {
        const response = await addProduct(requester, guerrinRegistrationData, mozzarella, 'incorrect token')

        expect(response.status).toBe(FORBIDDEN)
        expect(response.body).toEqual({
            error: 'invalid token or unauthorized user'
        })
    })

    it('cannot add a product if the name is not of type string', async () => {
        const token = await loginToken(requester, bancheroRegistrationData)

        const badPizza = { ...mozzarella, name: 123 }

        const response = await addProduct(requester, bancheroRegistrationData, badPizza, token)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product name" must be a string'
        })
    })

    it('cannot add a product if the description is not of type string', async () => {
        const token = await loginToken(requester, bancheroRegistrationData)

        const badPizza = { ...mozzarella, description: 123 }

        const response = await addProduct(requester, bancheroRegistrationData, badPizza, token)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product description" must be a string'
        })
    })

    it('cannot add a product if the price is not of type number', async () => {
        const token = await loginToken(requester, bancheroRegistrationData)

        const badPizza = { ...mozzarella, price: 'not a number' }

        const response = await addProduct(requester, bancheroRegistrationData, badPizza, token)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product price" must be a number'
        })
    })

    it('cannot add a product if the imageURL is not of type String', async () => {
        const token = await loginToken(requester, bancheroRegistrationData)

        const badPizza = { ...mozzarella, imageURL: 123 }

        const response = await addProduct(requester, bancheroRegistrationData, badPizza, token)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product imageURL" must be a string'
        })
    })

    it('cannot add a product if a name is not provided', async () => {
        const token = await loginToken(requester, bancheroRegistrationData)

        const badPizza = { ...mozzarella, name: undefined }

        const response = await addProduct(requester, bancheroRegistrationData, badPizza, token)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product name" is required'
        })
    })

    it('cannot add a product if a imageURL is not provided', async () => {
        const token = await loginToken(requester, bancheroRegistrationData)

        const badPizza = { ...mozzarella, imageURL: undefined }

        const response = await addProduct(requester, bancheroRegistrationData, badPizza, token)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product imageURL" is required'
        })
    })

    it('cannot add a product if a price is not provided', async () => {
        const token = await loginToken(requester, bancheroRegistrationData)

        const badPizza = { ...mozzarella, price: undefined }

        const response = await addProduct(requester, bancheroRegistrationData, badPizza, token)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product price" is required'
        })
    })

    it('cannot add a product if a name has more than thirteen characters', async () => {
        const token = await loginToken(requester, bancheroRegistrationData)

        const badPizza = { ...mozzarella, name: "12345678901234" }

        const response = await addProduct(requester, bancheroRegistrationData, badPizza, token)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product name" length must be less than or equal to 13 characters long'
        })
    })

})
