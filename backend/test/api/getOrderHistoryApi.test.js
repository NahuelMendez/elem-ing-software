const request = require('supertest')
const {createApp} = require('../../src/api/app')
const testObjects = require('../testObjects')
const {OK, FORBIDDEN, UNAUTHORIZED} = require("../../src/api/statusCode")

const { kentRegistrationData } = testObjects.consumersRegistrationData
const {bancheroRegistrationData} = testObjects.pizzeriasRegistrationData
const {mozzarella} = testObjects.productsData

const { 
    loginToken,
    getOrderHistory,
    createOrder,
    addProduct
} = require('../helpers/apiHelperFunctions')

describe('Api get order history', () => {
    let requester

    beforeEach(async () => {
        requester = request(createApp())
    })

    it('get the empty order history of a registered consumer', async () => {
        const token = await loginToken(requester, kentRegistrationData)

        const response = await getOrderHistory(requester, token)

        expect(response.status).toBe(OK)
        expect(response.body).toEqual([])
    })

    it('get the order history of a registered consumer with orders', async () => {
        const tokenPizzeria = await loginToken(requester, bancheroRegistrationData)
        const tokenConsumer = await loginToken(requester, kentRegistrationData)
        
        const order = [{ productName: mozzarella.name, quantity: 2 }]
        await addProduct(requester, bancheroRegistrationData, mozzarella, tokenPizzeria)
        await createOrder(requester, bancheroRegistrationData, order, tokenConsumer)

        const response = await getOrderHistory(requester, tokenConsumer)

        expect(response.status).toBe(OK)
        expect(response.body).toEqual([{pizzeriaName: bancheroRegistrationData.name, total: 20}])
    })

    it('get the order history of a unauthorized user', async () => {
        const tokenPizzeria = await loginToken(requester, bancheroRegistrationData)

        const response = await getOrderHistory(requester, tokenPizzeria)

        expect(response.status).toBe(FORBIDDEN)
        expect(response.body).toEqual( {
            error: 'invalid token or unauthorized user'
        })
    })

    it('cannot get the order history when the token is missing', async () => {
        const response = await requester.get('/api/order')

        expect(response.status).toBe(UNAUTHORIZED)
        expect(response.body).toEqual({
            error: 'token missing'
        })
    })

})