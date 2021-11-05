const puppeteer = require('puppeteer')
const {
    registerAndLoginPizzeria,
    goto,
    expectPath,
    clickAndWait
} = require('./helpers/helpers')

const { createPizzeriaRegistrationData } = require('../test/testObjects')

jest.setTimeout(15000)

describe('Pizzeria home', () => {
    let browser
    let page

    beforeEach(async () => {
        browser = await puppeteer.launch({headless: false})
        page = await browser.newPage()
    })

    afterEach(async () => {
        await browser.close()
    })

    it(`a pizzeria's navbar should have a "home" button`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        await registerAndLoginPizzeria(page, pizzeriaData)

        await page.waitForSelector('.navBar [name="goto-home-button"]')
    })

    it(`when an authenticated pizzeria clicks the home button, it should be redirected to it's home page`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        await registerAndLoginPizzeria(page, pizzeriaData)

        await goto(page, '/menu')

        await page.waitForSelector('.navBar [name="goto-home-button"]')
        await clickAndWait(page, '.navBar [name="goto-home-button"]')

        expectPath(page, '/home')
    })
})
