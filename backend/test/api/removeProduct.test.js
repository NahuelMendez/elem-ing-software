const request = require('supertest')
const {createApp} = require('../../src/api/app')

const {deleteProductPath} = require('../helpers/pathFactory')

const {OK, NOT_FOUND, UNAUTHORIZED, FORBIDDEN} = require("../../src/api/statusCode")
const testObjects = require('../testObjects')

const { bancheroRegistrationData} = testObjects.pizzeriasRegistrationData
const { mozzarella} = testObjects.productsData

const {
    addProduct,
    deleteProduct,
    getMenu,
    loginToken
} = require('../helpers/apiHelperFunctions')

describe('Api remove product from menu', () => {
    let requester

    beforeEach(async () => {
        requester = request(createApp())
    })

    it(`given a registered pizzeria when a product is removed from it's menu the product is no longer on it's menu`, async () => {
        const token = await loginToken(requester, bancheroRegistrationData)
        await addProduct(requester, bancheroRegistrationData, mozzarella, token)

        await deleteProduct(requester, bancheroRegistrationData, mozzarella, token)

        const response = await getMenu(requester, bancheroRegistrationData)
        await expect(response.body).toEqual([])
    })

    it(`given a registered pizzeria when a product is removed from it's menu the response has the removed product name`, async () => {
        const token = await loginToken(requester, bancheroRegistrationData)
        await addProduct(requester, bancheroRegistrationData, mozzarella, token)

        const response = await deleteProduct(requester, bancheroRegistrationData, mozzarella, token)

        expect(response.status).toBe(OK)
        expect(response.body).toEqual({removed: mozzarella.name})
    })

    it(`given a registered pizzeria when it ask to remove a product missing from it's menu it fails`, async () => {
        const token = await loginToken(requester, bancheroRegistrationData)
        await addProduct(requester, bancheroRegistrationData, mozzarella, token)
        await addProduct(requester, bancheroRegistrationData, mozzarella, token)

        const missingProductName = 'MISSING_PRODUCT_NAME'
        const response = await deleteProduct(requester, bancheroRegistrationData, {name: missingProductName}, token)

        expect(response.status).toBe(NOT_FOUND)
        expect(response.body).toEqual({error: `Product ${missingProductName} not found` })
    })

    it('cannot add a product when the token is missing', async () => {
        const token = await loginToken(requester, bancheroRegistrationData)
        await addProduct(requester, bancheroRegistrationData, mozzarella, token)
        
        const response = await requester.delete(deleteProductPath(bancheroRegistrationData.name, mozzarella.name))

        expect(response.status).toBe(UNAUTHORIZED)
        expect(response.body).toEqual({
            error: 'token missing'
        })
    })

    it('cannot add a product for a unauthorized pizzeria', async () => {
        const token = await loginToken(requester, bancheroRegistrationData)
        await addProduct(requester, bancheroRegistrationData, mozzarella, token)

        const response = await deleteProduct(requester, bancheroRegistrationData, mozzarella, "invalid token")

        expect(response.status).toBe(FORBIDDEN)
        expect(response.body).toEqual({
            error: 'invalid token or unauthorized user'
        })
    })

})