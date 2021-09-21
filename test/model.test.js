const {CosoService} = require('../src/model/cosoService')

describe('Coso', () => {

        it('nombre de test', () => {
            const cosoService = new CosoService()
            expect(cosoService.algo()).toEqual('Hola, soy algo')
        })

})
