const request = require('supertest')
const {createApp} = require('../../src/api/app')
const {OK, BAD_REQUEST, FORBIDDEN} = require("../../src/api/statusCode")

const testObjects = require('../testObjects')

const { kentRegistrationData } = testObjects.consumersRegistrationData
const {bancheroRegistrationData, guerrinRegistrationData} = testObjects.pizzeriasRegistrationData
const { mozzarella, bacon} = testObjects.productsData

const {
    loginToken,
    addProduct,
    createOrder
} = require('../helpers/apiHelperFunctions')

describe('Api create Order', () => {
    let requester
    let tokenConsumer
    let tokenPizzeria

    beforeEach(async () => {
        requester = request(createApp())
        tokenConsumer = await loginToken(requester, kentRegistrationData)
        tokenPizzeria = await loginToken(requester, bancheroRegistrationData)

        await addProduct(requester, bancheroRegistrationData, mozzarella, tokenPizzeria)
    })

    it("a registered consumer can place an order", async () => {
        const order = [{ productName: mozzarella.name, quantity: 1 }]
        
        const response = await createOrder(requester, bancheroRegistrationData, order, tokenConsumer)

        expect(response.status).toBe(OK)
        expect(response.body).toEqual({
            message: "the order was confirmed"
        })
    })

    it("a registered consumer cannot place an order to a not registered pizzeria", async () => {
        const order = [{ productName: mozzarella.name, quantity: 1 }]

        const response = await createOrder(requester, guerrinRegistrationData, order, tokenConsumer)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: `Pizzeria ${guerrinRegistrationData.name} not found`
        })
    })

    it("a registered consumer cannot place an order with no products", async () => {
        const response = await createOrder(requester, bancheroRegistrationData, [], tokenConsumer)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: `Cannot place an order with no products`
        })
    })

    it('cannot create a order for a unauthorized consumer', async () => {
        const order = [{ productName: mozzarella.name, quantity: 1 }]
        
        const response = await createOrder(requester, bancheroRegistrationData, order, 'invalid token')

        expect(response.status).toBe(FORBIDDEN)
        expect(response.body).toEqual({
            error: 'invalid token or unauthorized user'
        })
    })

})