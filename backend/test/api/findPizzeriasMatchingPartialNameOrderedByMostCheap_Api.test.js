const request = require('supertest')
const { createSearchPizzeriaPath } = require('../helpers/pathFactory')
const {createApp} = require('../../src/api/app')
const {OK} = require("../../src/api/statusCode")

const { createPizzeriaRegistrationAPIData, createPizzaData} = require('../testObjects')

const {
    loginToken,
    addProduct
} = require('../helpers/apiHelperFunctions')
const {Product} = require("../../src/model/Product");

describe('Api find Pizzeria matching partial name', () => {
    let requester

    let pizzeriaA1Data
    let pizzeriaA2Data
    let pizzeriaA3Data
    let pizzeriaBData

    let productWithPrice1PesoData
    let productWithPrice2PesosData
    let productWithPrice3PesosData
    let productWithPrice1000PesosData

    beforeEach(async () => {
        requester = request(createApp())

        pizzeriaA1Data = createPizzeriaRegistrationAPIData({name: 'pizzeria_a1'})
        pizzeriaA2Data = createPizzeriaRegistrationAPIData({name: 'pizzeria_a2'})
        pizzeriaA3Data = createPizzeriaRegistrationAPIData({name: 'pizzeria_a3'})
        pizzeriaBData = createPizzeriaRegistrationAPIData({name: 'pizzeria_b'})

        productWithPrice1PesoData = createPizzaData({name: 'a', price: 1})
        productWithPrice2PesosData = createPizzaData({name: 'b', price: 2})
        productWithPrice3PesosData =  createPizzaData({name: 'c', price: 3})
        productWithPrice1000PesosData =  createPizzaData({name: 'c', price: 1000})
    })

    it('can find pizzerias matching a partial name sorted by most cheap', async () => {
        const tokenPizzeriaA1 = await loginToken(requester, {...pizzeriaA1Data, rol: 'pizzeria'})
        await addProduct(requester, pizzeriaA1Data, productWithPrice1PesoData, tokenPizzeriaA1)
        await addProduct(requester, pizzeriaA1Data, productWithPrice1000PesosData, tokenPizzeriaA1)

        const tokenPizzeriaA2 = await loginToken(requester, {...pizzeriaA2Data, rol: 'pizzeria'})
        await addProduct(requester, pizzeriaA2Data, productWithPrice1PesoData, tokenPizzeriaA2)

        const tokenPizzeriaA3 = await loginToken(requester, {...pizzeriaA3Data, rol: 'pizzeria'})
        await addProduct(requester, pizzeriaA3Data, productWithPrice1PesoData, tokenPizzeriaA3)
        await addProduct(requester, pizzeriaA3Data, productWithPrice2PesosData, tokenPizzeriaA3)
        await addProduct(requester, pizzeriaA3Data, productWithPrice3PesosData, tokenPizzeriaA3)

        const tokenPizzeriaB = await loginToken(requester, {...pizzeriaBData, rol: 'pizzeria'})
        await addProduct(requester, pizzeriaBData, productWithPrice1PesoData, tokenPizzeriaB)

        const response = await requester.get(createSearchPizzeriaPath('pizzeria_a', 'MOST_CHEAP'))
        
        expect(response.status).toBe(OK)
        expect(response.body).toHaveLength(3)
        expect(response.body[0].name).toEqual(pizzeriaA2Data.name)
        expect(response.body[1].name).toEqual(pizzeriaA3Data.name)
        expect(response.body[2].name).toEqual(pizzeriaA1Data.name)
    })

})