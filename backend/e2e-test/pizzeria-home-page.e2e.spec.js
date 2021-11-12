const puppeteer = require('puppeteer')
const {
    expectPath,
    registerAndLoginPizzeria,
    logoutPizzeria,
    goToMenuForPizzeria
} = require('./helpers/helpers')

const { createPizzeriaRegistrationData, createPizzaData } = require('../test/testObjects')

jest.setTimeout(15000)

describe('Pizzeria home', () => {
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

    it('when an authenticated pizzeria click on "editar menu", it is redirected to its menu edition page', async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        await registerAndLoginPizzeria(page, pizzeriaData)

        await goToMenuForPizzeria(page)

        expectPath(page, '/menu')
    })

    it('when an authenticated pizzeria logout it is redirected to the login page', async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        await registerAndLoginPizzeria(page, pizzeriaData)

        await logoutPizzeria(page)

        expectPath(page, '/login')
    })
})
