const puppeteer = require('puppeteer')
const {
    goto,
    registerPizzeria,
    registerAndLoginConsumer,
    expectTextContent, clickAndWait, expectPath
} = require('./helpers/helpers')

const { createPizzeriaRegistrationData, createConsumerRegistrationData } = require('../test/testObjects')

jest.setTimeout(10000)

const searchInputSelector = 'form > input[name="search-input"]'
const searchButtonSelector = 'form > img[alt="search-icon"]'

describe('Pizzeria data visualization', () => {
    let browser
    let page

    beforeEach(async () => {
        browser = await puppeteer.launch({headless: false})
        page = await browser.newPage()
    })

    afterEach(async () => {
        await browser.close()
    })

    it('a user home page should have a search bar on the header', async () => {
        const consumerData = createConsumerRegistrationData({})
        await registerAndLoginConsumer(page, consumerData)

        await page.waitForSelector(searchInputSelector)
        await page.waitForSelector(searchButtonSelector)
    })

    it('when a user on his home page clicks the search icon the browser is redirected to the search path', async () => {
        const consumerData = createConsumerRegistrationData({})
        await registerAndLoginConsumer(page, consumerData)

        await clickAndWait(page, searchButtonSelector)

        expectPath(page, '/busquedas')
    })

})