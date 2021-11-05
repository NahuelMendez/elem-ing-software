const puppeteer = require('puppeteer')
const {
    registerAndLoginPizzeria
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
})
