const { bancheroRegistrationData } = require('../../test/testObjects').pizzeriasRegistrationData

describe('Pizzeria registration', () => {

    beforeEach(() => {

    })

    it('After register a new pizzeria user should be redirected to login page', () => {
        cy.visitRegister()

        cy.registerPizzeria({ ...bancheroRegistrationData, confirmPassword: bancheroRegistrationData.password })

        cy.pathShouldBe('/login')
    })

})
