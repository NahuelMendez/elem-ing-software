const request = require('supertest')
const {createApp} = require('../../src/api/app')
const { createUpdateProductPath } = require('../helpers/pathFactory')
const {OK, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN} = require("../../src/api/statusCode")

const testObjects = require('../testObjects')

const {bancheroRegistrationData} = testObjects.pizzeriasRegistrationData
const { mozzarella, bacon} = testObjects.productsData

const {
    loginToken,
    addProduct,
    updatedProduct
} = require('../helpers/apiHelperFunctions')

describe("Api edit a product of pizzeria's menu", () => {
    let requester

    beforeEach(async () => {
        requester = request(createApp())
    })

    it('a product from the menu of a registered pizzeria can be updated with a reference product with a different name', async () => {
        const token = await loginToken(requester, bancheroRegistrationData)

        await addProduct(requester, bancheroRegistrationData, mozzarella, token)

        const response = await updatedProduct(requester, bancheroRegistrationData, mozzarella, bacon, token)

        expect(response.status).toBe(OK)
        expect(response.body).toEqual({
            message: "The product was updated successfully"
        })
    })

    it('cannot update the name of a product in a menu when another product in that menu has that name', async () => {
        const token = await loginToken(requester, bancheroRegistrationData)

        await addProduct(requester, bancheroRegistrationData, mozzarella, token)
        await addProduct(requester, bancheroRegistrationData, bacon, token)

        const response = await updatedProduct(
            requester, 
            bancheroRegistrationData, 
            bacon, 
            {...bacon, name: mozzarella.name},
            token
        )

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: "A menu cannot have repeated product names"
        })
    })

    it('cannot update a product for a registered pizzeria with a product name not mathing any product name in the menu', async () => {
        const token = await loginToken(requester, bancheroRegistrationData)

        const response = await updatedProduct(
            requester, 
            bancheroRegistrationData, 
            bacon, 
            mozzarella,
            token
        )

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: `Product ${bacon.name} not found`
        })
    })

    it('cannot update a product when the token is missing', async () => {
        const response = await requester.put(createUpdateProductPath(bancheroRegistrationData.name, mozzarella.name))
            .send(bacon)

        expect(response.status).toBe(UNAUTHORIZED)
        expect(response.body).toEqual({
            error: 'token missing'
        })
    })

    it('cannot update a product when the token is unauthorized', async () => {
        const response = await await updatedProduct(
            requester, 
            bancheroRegistrationData, 
            bacon, 
            mozzarella,
            'incorrect token'
        )

        expect(response.status).toBe(FORBIDDEN)
        expect(response.body).toEqual({
            error: 'invalid token or unauthorized user'
        })
    })

    it('cannot update a product if the name is not of type string', async () => {
        const token = await loginToken(requester, bancheroRegistrationData)
        await addProduct(requester, bancheroRegistrationData, mozzarella, token)   
        
        const badPizza = { ...mozzarella, name: 123 }

        const response = await updatedProduct(requester, bancheroRegistrationData, mozzarella, badPizza, token)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product name" must be a string'
        })
    })

    it('cannot update a product if the description is not of type string', async () => {
        const token = await loginToken(requester, bancheroRegistrationData)
        await addProduct(requester, bancheroRegistrationData, mozzarella, token)

        const badPizza = { ...mozzarella, description: 123 }

        const response = await updatedProduct(requester, bancheroRegistrationData, mozzarella, badPizza, token)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product description" must be a string'
        })
    })

    it('cannot update a product if the price is not of type number', async () => {
        const token = await loginToken(requester, bancheroRegistrationData)
        await addProduct(requester, bancheroRegistrationData, mozzarella, token)

        const badPizza = { ...mozzarella, price: 'not a number' }

        const response = await updatedProduct(requester, bancheroRegistrationData, mozzarella, badPizza, token)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product price" must be a number'
        })
    })

    it('cannot update a product if the imageURL is not of type String', async () => {
        const token = await loginToken(requester, bancheroRegistrationData)
        await addProduct(requester, bancheroRegistrationData, mozzarella, token)

        const badPizza = { ...mozzarella, imageURL: 123 }

        const response = await updatedProduct(requester, bancheroRegistrationData, mozzarella, badPizza, token)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product imageURL" must be a string'
        })
    })

    it('cannot update a product if a name is not provided', async () => {
        const token = await loginToken(requester, bancheroRegistrationData)
        await addProduct(requester, bancheroRegistrationData, mozzarella, token)

        const badPizza = { ...mozzarella, name: undefined }

        const response = await updatedProduct(requester, bancheroRegistrationData, mozzarella, badPizza, token)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product name" is required'
        })
    })

    it('cannot update a product if a imageURL is not provided', async () => {
        const token = await loginToken(requester, bancheroRegistrationData)
        await addProduct(requester, bancheroRegistrationData, mozzarella, token)

        const badPizza = { ...mozzarella, imageURL: undefined }

        const response = await updatedProduct(requester, bancheroRegistrationData, mozzarella, badPizza, token)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product imageURL" is required'
        })
    })

    it('cannot update a product if a price is not provided', async () => {
        const token = await loginToken(requester, bancheroRegistrationData)
        await addProduct(requester, bancheroRegistrationData, mozzarella, token)

        const badPizza = { ...mozzarella, price: undefined }

        const response = await updatedProduct(requester, bancheroRegistrationData, mozzarella, badPizza, token)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product price" is required'
        })
    })
})