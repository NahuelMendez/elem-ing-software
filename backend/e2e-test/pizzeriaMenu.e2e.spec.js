const puppeteer = require('puppeteer')
const {
    goto,
    clickAndWait,
    clickLink,
    submitLogin,
    expectPath,
    submitPizzeriaRegistration,
    registerPizzeria,
    registerAndLoginPizzeria,
    logoutPizzeria,
    goToMenuForPizzeria,
    registerAsPizzeriaAndGoToMenu,
    addProduct
} = require('./helpers/helpers')

const { createPizzeriaRegistrationData, createPizzaData } = require('../test/testObjects')

describe('Pizzeria registration', () => {
    let browser
    let page

    beforeEach(async () => {
        browser = await puppeteer.launch({headless: false})
        //browser = await puppeteer.launch()
        page = await browser.newPage()
    })

    afterEach(async () => {
        browser.close()
    })

    it('when an authenticated pizzeria click on "editar menu", it is redirected to its menu edition page', async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        await registerAndLoginPizzeria(page, pizzeriaData)

        await goToMenuForPizzeria(page)

        expectPath(page, '/menu')
    })

    it('when an authenticated pizzeria add a new product to its menu, the user sees a notification text', async () => {
        //const pizzeriaData = createPizzeriaRegistrationData({})
        //await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})
        pizzeriaData.name = 'pizzeria'
        await registerAndLoginPizzeria(page, pizzeriaData)
        await goToMenuForPizzeria(page)

        await addProduct(page, pizzaData)

        // cy.get('p[name="product-submition-message"]').should(($div) =>
        //     expect($div).to.have.text('Se ha ingresado el producto correctamente')
        // )
        //await expect(page.content()).resolves.toContain('Se ha ingresado el producto correctamente')
    })

})