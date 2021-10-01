const { bancheroRegistrationData } = require('../../test/testObjects').pizzeriasRegistrationData
const { mozzarella } = require('../../test/testObjects').productsData
const { createPizzeriaRegistrationData } = require('../../test/testObjects')

bancheroRegistrationData.name = 'pizzeria'

describe('Pizzeria registration', () => {

    it('when a user in the login page click the button to register, it is redirected to the registration page', () => {
        cy.visitLogin()

        cy.clickRegisterLink()

        cy.pathShouldBe('/register')
    })

    it('when a not registered pizzeria submits valid registration data, it is redirected to the login page', () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        cy.visitRegister()

        cy.submitPizzeriaRegistration(pizzeriaData)

        cy.pathShouldBe('/login')
    })

    it('when a registered pizzeria login with his username and password, it is redirected to its home page', () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        cy.registerPizzeria(pizzeriaData)

        cy.submitLogin(pizzeriaData)

        cy.pathShouldBe('/home')
    })

    it('when an authenticated pizzeria logout it is redirected to the login page', () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        cy.registerAndLoginPizzeria(pizzeriaData)

        cy.logout()

        cy.pathShouldBe('/login')
    })

})
