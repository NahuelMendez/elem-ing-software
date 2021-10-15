const request = require('supertest')
const {createApp} = require('../../src/api/app')
const {OK, BAD_REQUEST} = require("../../src/api/statusCode")

const testObjects = require('../testObjects')

const {bancheroRegistrationData} = testObjects.pizzeriasRegistrationData
const { mozzarella, bacon} = testObjects.productsData

const {
    loginToken,
    registerUser,
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

        const response = await updatedProduct(requester, bancheroRegistrationData, mozzarella, bacon)

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
            {...bacon, name: mozzarella.name}
        )

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: "A menu cannot have repeated product names"
        })
    })

    it('cannot update a product for a registered pizzeria with a product name not mathing any product name in the menu', async () => {
        await registerUser(requester, bancheroRegistrationData)

        const response = await updatedProduct(
            requester, 
            bancheroRegistrationData, 
            bacon, 
            mozzarella
        )

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: `Product ${bacon.name} not found`
        })
    })

})