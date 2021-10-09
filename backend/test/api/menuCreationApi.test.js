const request = require('supertest')
const {createApp} = require('../../src/api/app')
const {registerPath, loginPath} = require("../../src/api/path")
const { createMenuPath } = require('../helpers/pathFactory')
const {BAD_REQUEST, OK} = require("../../src/api/statusCode")
const testObjects = require('../testObjects')

const { bancheroRegistrationData, guerrinRegistrationData } = testObjects.pizzeriasRegistrationData
const { mozzarella, bacon } = testObjects.productsData

describe('Api menu creation', () => {
    let requester

    beforeEach(async () => {
        requester = request(createApp())
    })

    it(`a registered pizzeria can add a product to it's menu`, async () => {
        const token = await loginToken(bancheroRegistrationData)

        const response = await requester
            .put(createMenuPath(bancheroRegistrationData.name))
            .send(mozzarella)
            .set('Authorization', token)

        expect(response.status).toBe(OK)
        expect(response.body).toEqual(mozzarella)
    })

    it("a pizzeria's menu cannot have products with repeated name", async () => {
        const token = await loginToken(guerrinRegistrationData)

        await requester
            .put(createMenuPath(guerrinRegistrationData.name))
            .send(mozzarella)
            .set('Authorization', token)
        
        const response = await requester
            .put(createMenuPath(guerrinRegistrationData.name))
            .send({...bacon, name: mozzarella.name})
            .set('Authorization', token)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: 'A menu cannot have repeated product names'
        })
    })

    it('cannot add a product when the token is missing', async () => {
        const response = await requester
            .put(createMenuPath(guerrinRegistrationData.name))
            .send(mozzarella)

        expect(response.status).toBe(401)
        expect(response.body).toEqual({
            error: 'token missing'
        })
    })

    it('cannot add a product for a unauthorized pizzeria', async () => {
        const response = await requester
            .put(createMenuPath(guerrinRegistrationData.name))
            .send(mozzarella)
            .set('Authorization', 'incorrect token')

        expect(response.status).toBe(403)
        expect(response.body).toEqual({
            error: 'invalid token or unauthorized user'
        })
    })

    it('cannot add a product if the name is not of type string', async () => {
        await requester.post(registerPath).send({...bancheroRegistrationData, rol: 'pizzeria'})

        const badPizza = { ...mozzarella, name: 123 }

        const response = await sendRequestPutMenuCreation(requester, badPizza)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product name" must be a string'
        })
    })

    it('cannot add a product if the description is not of type string', async () => {
        await requester.post(registerPath).send({...bancheroRegistrationData, rol: 'pizzeria'})

        const badPizza = { ...mozzarella, description: 123 }

        const response = await sendRequestPutMenuCreation(requester, badPizza)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product description" must be a string'
        })
    })

    it('cannot add a product if the price is not of type number', async () => {
        await requester.post(registerPath).send({...bancheroRegistrationData, rol: 'pizzeria'})

        const badPizza = { ...mozzarella, price: 'not a number' }

        const response = await sendRequestPutMenuCreation(requester, badPizza)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product price" must be a number'
        })
    })

    it('cannot add a product if the imageURL is not of type String', async () => {
        await requester.post(registerPath).send({...bancheroRegistrationData, rol: 'pizzeria'})

        const badPizza = { ...mozzarella, imageURL: 123 }

        const response = await sendRequestPutMenuCreation(requester, badPizza)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product imageURL" must be a string'
        })
    })

    it('cannot add a product if a name is not provided', async () => {
        await requester.post(registerPath).send({...bancheroRegistrationData, rol: 'pizzeria'})

        const badPizza = { ...mozzarella, name: undefined }

        const response = await sendRequestPutMenuCreation(requester, badPizza)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product name" is required'
        })
    })

    it('cannot add a product if a imageURL is not provided', async () => {
        await requester.post(registerPath).send({...bancheroRegistrationData, rol: 'pizzeria'})

        const badPizza = { ...mozzarella, imageURL: undefined }

        const response = await sendRequestPutMenuCreation(requester, badPizza)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product imageURL" is required'
        })
    })

    it('cannot add a product if a price is not provided', async () => {
        await requester.post(registerPath).send({...bancheroRegistrationData, rol: 'pizzeria'})

        const badPizza = { ...mozzarella, price: undefined }

        const response = await sendRequestPutMenuCreation(requester, badPizza)

        expect(response.status).toBe(BAD_REQUEST)
        expect(response.body).toEqual({
            error: '"product price" is required'
        })
    })

    async function loginToken(user) {
        await requester.post(registerPath).send({...user, rol: 'pizzeria'})
        const responseLogin = await requester.post(loginPath).send({
            email: user.email,
            password: user.password
        })
        return responseLogin.get('Authorization')
    }

})

async function sendRequestPutMenuCreation(requester, badPizza) {
    return await requester
        .put(createMenuPath(bancheroRegistrationData.name))
        .send(badPizza)
}
