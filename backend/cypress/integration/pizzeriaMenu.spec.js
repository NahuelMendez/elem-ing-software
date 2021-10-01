const { bancheroRegistrationData } = require('../../test/testObjects').pizzeriasRegistrationData
const { mozzarella } = require('../../test/testObjects').productsData
const { createPizzeriaRegistrationData } = require('../../test/testObjects')

bancheroRegistrationData.name = 'pizzeria'

describe(`Pizzeria's menu`, () => {

    it('when an authenticated pizzeria click on "editar menu", it is redirected to its menu edition page', () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        cy.registerAndLoginPizzeria(pizzeriaData)

        cy.goToEditMenu()

        cy.pathShouldBe('/menu')
    })

    it('when an authenticated pizzeria add a new product to its menu, the user sees a notification text', () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        pizzeriaData.name = 'pizzeria'
        cy.registerAndLoginPizzeria(pizzeriaData)
        cy.goToEditMenu()

        cy.addProduct(mozzarella)

        cy.get('p[name="product-submition-message"]').should(($div) =>
            expect($div).to.have.text('Se ha ingresado el producto correctamente')
        )
    })

})
