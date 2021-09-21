const request = require('supertest')
const {app} = require('../src/api/app')

describe('API', () => {

    it('nombre de test', async () => {
        const response = await request(app).get('/api/')

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            mensaje: 'Hola, soy algo'
        })
    })

})