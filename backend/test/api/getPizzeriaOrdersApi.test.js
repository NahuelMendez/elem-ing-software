const request = require('supertest')
const {createApp} = require('../../src/api/app')
const testObjects = require('../testObjects')
const {OK, FORBIDDEN, UNAUTHORIZED} = require("../../src/api/statusCode")

const { kentRegistrationData } = testObjects.consumersRegistrationData
const {bancheroRegistrationData, guerrinRegistrationData} = testObjects.pizzeriasRegistrationData
const {mozzarella} = testObjects.productsData

const { 
    loginToken,
    createOrder,
    addProduct
} = require('../helpers/apiHelperFunctions')

describe('Api get pizzeria orders', () => {
    let requester

    let tokenPizzeria
    let tokenConsumer


    beforeEach(async () => {
        requester = request(createApp())

        tokenPizzeria = await loginToken(requester, bancheroRegistrationData)
        tokenPizzeriaWithoutProducts = await loginToken(requester, guerrinRegistrationData)
        tokenConsumer = await loginToken(requester, kentRegistrationData)

        const order = [{ productName: mozzarella.name, quantity: 2 }]

        await addProduct(requester, bancheroRegistrationData, mozzarella, tokenPizzeria)
        await createOrder(requester, bancheroRegistrationData, order, tokenConsumer)
    })

    it('No order was found in the pizzeria when no order was made in that pizzeria', async () => {
        const response = await requester.get('/api/pizzeria/order')

        expect(response.status).toBe(OK)
        expect(response.body).toHaveLength(0)
    })

})