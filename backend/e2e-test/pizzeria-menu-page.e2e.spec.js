const puppeteer = require('puppeteer')
const {
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
        await browser.close()
    })

    it('when an authenticated pizzeria add a new product to its menu, a notification message appears', async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})
        pizzeriaData.name = 'pizzeria'
        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)

        await addProduct(page, pizzaData)

        const content = await page.$eval('[name="submited-product-message"]', element => element.textContent)

        expect(content).toContain('Se ha ingresado el producto correctamente')
    })

})