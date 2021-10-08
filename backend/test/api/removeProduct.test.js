const request = require('supertest')
const {createApp} = require('../../src/api/app')

const {BAD_REQUEST, OK, NOT_FOUND} = require("../../src/api/statusCode")
const testObjects = require('../testObjects')

const { bancheroRegistrationData, guerrinRegistrationData } = testObjects.pizzeriasRegistrationData
const { mozzarella, bacon } = testObjects.productsData

const {
    registerPizzeria,
    addProduct,
    deleteProduct,
    getMenu
} = require('../helpers/apiHelperFunctions')

describe('Api remove product from menu', () => {
    let requester

    beforeEach(async () => {
        requester = request(createApp())
    })

    it(`given a registered pizzeria when a product is removed from it's menu the product is no longer on it's menu`, async () => {
        await registerPizzeria(requester, bancheroRegistrationData)
        await addProduct(requester, bancheroRegistrationData, mozzarella)

        await deleteProduct(requester, bancheroRegistrationData, mozzarella)

        const response = await getMenu(requester, bancheroRegistrationData)
        await expect(response.body).toEqual([])
    })

    it(`given a registered pizzeria when a product is removed from it's menu the response has the removed product name`, async () => {
        await registerPizzeria(requester, bancheroRegistrationData)
        await addProduct(requester, bancheroRegistrationData, mozzarella)

        const response = await deleteProduct(requester, bancheroRegistrationData, mozzarella)

        expect(response.status).toBe(OK)
        expect(response.body).toEqual({removed: mozzarella.name})
    })

    it(`given a registered pizzeria when it ask to remove a product missing from it's menu it fails`, async () => {
        await registerPizzeria(requester, bancheroRegistrationData)
        await addProduct(requester, bancheroRegistrationData, mozzarella)

        const missingProductName = 'MISSING_PRODUCT_NAME'
        const response = await deleteProduct(requester, bancheroRegistrationData, {name: missingProductName})

        expect(response.status).toBe(NOT_FOUND)
        expect(response.body).toEqual({error: `Product ${missingProductName} not found` })
    })

})