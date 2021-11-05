const request = require('supertest')
const {createApp} = require('../../src/api/app')
const testObjects = require('../testObjects')
const {OK, FORBIDDEN, UNAUTHORIZED} = require("../../src/api/statusCode")

const { kentRegistrationData } = testObjects.consumersRegistrationData
const {bancheroRegistrationData, guerrinRegistrationData} = testObjects.pizzeriasRegistrationData
const {mozzarella, bacon} = testObjects.productsData

const { 
    loginToken,
    createOrder,
    addProduct,
    getPizzeriaOrders
} = require('../helpers/apiHelperFunctions')

describe('Api get pizzeria orders', () => {
    let requester

    let tokenPizzeria
    let tokenConsumer
    let tokenPizzeriaWithoutOrders


    beforeEach(async () => {
        requester = request(createApp())

        tokenPizzeria = await loginToken(requester, bancheroRegistrationData)
        tokenPizzeriaWithoutOrders = await loginToken(requester, guerrinRegistrationData)
        tokenConsumer = await loginToken(requester, kentRegistrationData)

        const order1 = [{ productName: mozzarella.name, quantity: 2 }]
        const order2 = [{ productName: bacon.name, quantity: 2 }]

        await addProduct(requester, bancheroRegistrationData, mozzarella, tokenPizzeria)
        await addProduct(requester, bancheroRegistrationData, bacon, tokenPizzeria)
        await createOrder(requester, bancheroRegistrationData, order1, tokenConsumer)
        await createOrder(requester, bancheroRegistrationData, order2, tokenConsumer)
    })

    it('No order was found to the pizzeria when no order was made to that pizzeria', async () => {
        const response = await getPizzeriaOrders(requester, tokenPizzeriaWithoutOrders)

        expect(response.status).toBe(OK)
        expect(response.body).toHaveLength(0)
    })

    it('can find the orders placed from a pizzeria sorted descending when the pizzeria received orders', async () => {
        const response = await getPizzeriaOrders(requester, tokenPizzeria)
        
        const orders = response.body

        expect(response.status).toBe(OK)
        expect(orders).toHaveLength(2)
        expect(orders[0]).toEqual({
            orderNumber: 2, 
            consumerName: kentRegistrationData.name, 
            telephone: kentRegistrationData.telephone, 
            email: kentRegistrationData.email, 
            total: 2, 
            lineItems: [{productName: bacon.name, quantity: 2, price: 1}]
        })
        expect(orders[1]).toEqual({
            orderNumber: 1, 
            consumerName: kentRegistrationData.name, 
            telephone: kentRegistrationData.telephone, 
            email: kentRegistrationData.email, 
            total: 20, 
            lineItems: [{productName: mozzarella.name, quantity: 2, price: 10}]
        })
        
    })

    it('cannot find pizzeria orders of a unauthorized user', async () => {
        const response = await getPizzeriaOrders(requester, tokenConsumer)

        expect(response.status).toBe(FORBIDDEN)
        expect(response.body).toEqual( {
            error: 'invalid token or unauthorized user'
        })
    })

    it('cannot find pizzeria orders when the token is missing', async () => {
        const response = await requester.get('/api/pizzeria/order')

        expect(response.status).toBe(UNAUTHORIZED)
        expect(response.body).toEqual({
            error: 'token missing'
        })
    })

})