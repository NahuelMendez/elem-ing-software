const request = require('supertest')
const {createApp} = require('../../src/api/app')
const {OK} = require("../../src/api/statusCode")
const testObjects = require('../testObjects')

const { kentRegistrationData } = testObjects.consumersRegistrationData
const { bancheroRegistrationData } = testObjects.pizzeriasRegistrationData
const { mozzarella, bacon } = testObjects.productsData

const {
    loginToken,
    addProduct,
    createOrder,
    getBestseller,
    getPizzeria
} = require('../helpers/apiHelperFunctions')

describe('Pizzas bestseller API', () => {
    let requester

    let tokenPizzeria
    let tokenConsumer

    beforeEach(async () => {
        requester = request(createApp())

        tokenPizzeria = await loginToken(requester, bancheroRegistrationData)
        tokenConsumer = await loginToken(requester, kentRegistrationData)
    })

    it('when there are no pizzas sold the ranking of best sellers is empty', async () => {
        const response = await getBestseller(requester)

        expect(response.status).toBe(OK)
        expect(response.body).toHaveLength(0)
    })

    it('when get the best selling pizzas, only the first five are shown', async () => {
        const pizzas = [
            mozzarella,
            {...mozzarella, name: 'napolitana'},
            bacon,
            {...bacon, name: 'pepperoni'},
            {...bacon, name: 'americana'},
            {...bacon, name: 'fugazzeta'}
        ]
        
        for (let pizza of pizzas)
            await addProduct(requester, bancheroRegistrationData, pizza, tokenPizzeria)

        const order = [
            { productName: pizzas[0].name, quantity: 10 },
            { productName: pizzas[1].name, quantity: 20 },
            { productName: pizzas[2].name, quantity: 30 },
            { productName: pizzas[3].name, quantity: 1 },
            { productName: pizzas[4].name, quantity: 8 },
            { productName: pizzas[5].name, quantity: 7 }
        ]

        await createOrder(requester, bancheroRegistrationData, order, tokenConsumer)

        const response = await getBestseller(requester)

        expect(response.status).toBe(OK)
        expect(response.body).toHaveLength(5)
        expect(response.body[0].product).toEqual(pizzas[2])
        expect(response.body[1].product).toEqual(pizzas[1])
        expect(response.body[2].product).toEqual(pizzas[0])
        expect(response.body[3].product).toEqual(pizzas[4])
        expect(response.body[4].product).toEqual(pizzas[5])
    })

})