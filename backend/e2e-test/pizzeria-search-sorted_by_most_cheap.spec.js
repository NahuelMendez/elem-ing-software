const puppeteer = require('puppeteer')
const {
    registerPizzeriaWithAmountOfProducts,
    registerAndLoginConsumer,
    clickAndWait,
    expectTextContent
} = require('./helpers/helpers')

const { createConsumerRegistrationData } = require('../test/testObjects')

jest.setTimeout(10000)

const searchInputSelector = 'form > input[name="search-input"]'
const searchButtonSelector = 'form > img[alt="search-icon"]'

const orderByMostCheapOptionSelector = 'select[name="orderBy"] option[value="MOST_CHEAP"]'

describe('Pizzeria search by partial name sorted by most cheap', () => {
    let browser
    let page

    beforeEach(async () => {
        browser = await puppeteer.launch({headless: false})
        page = await browser.newPage()
    })

    afterEach(async () => {
        await browser.close()
    })

    it('pizzerias search results page should have a dropdown with an option to sort pizzerias by most cheap', async () => {
        const { pizzeriaData } = await registerPizzeriaWithAmountOfProducts(page, 1)
  
        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))

        await page.type(searchInputSelector, pizzeriaData.name)
        await clickAndWait(page, searchButtonSelector)

        await page.waitForSelector(orderByMostCheapOptionSelector)
        await expectTextContent(page, orderByMostCheapOptionSelector, 'Mas economica')
    })

})
