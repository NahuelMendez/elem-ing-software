const puppeteer = require('puppeteer')

const {
    registerPizzeria,
    registerPizzeriaWithAmountOfProducts,
    registerAndLoginConsumer,
    searchPizzerias,
    expectTextContent
} = require('./helpers/helpers')

const { createConsumerRegistrationData, createPizzeriaRegistrationData } = require('../test/testObjects')

jest.setTimeout(20000)

const orderByDropdownSelector = 'select[name="orderBy"]'
const orderByMostCheapOptionSelector = `${orderByDropdownSelector} option[value="MOST_CHEAP"]`

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
        const pizzeriaName = `ZZZ${Date.now()}`
        await registerPizzeria(page, createPizzeriaRegistrationData({name: pizzeriaName}))
  
        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))

        await searchPizzerias(page, pizzeriaName)

        await page.waitForSelector(orderByMostCheapOptionSelector)
        await expectTextContent(page, orderByMostCheapOptionSelector, 'Mas economica')
    })
    
    it('a consumer can choose to order pizzerias search results by most cheap acording to its average price with ascending order', async () => {
        const pizzeriaDataWith2Products = await registerPizzeriaWithAmountOfProducts(page, 2)
        const pizzeriaDataWith1Products = await registerPizzeriaWithAmountOfProducts(page, 1)
  
        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))

        await searchPizzerias(page, 'p')

        await page.click(orderByDropdownSelector)
        await page.select(orderByDropdownSelector, "MOST_CHEAP")

        await page.waitForTimeout(1000)
        const cardTitles = await page.$$('.card-body')

        expect(cardTitles).toHaveLength(2)
        await expectTextContent(cardTitles[0], '.card-tittle', pizzeriaDataWith1Products.pizzeriaData.name) //TODO: corregir error ortografico en front y en tests ("tittle")
        await expectTextContent(cardTitles[1], '.card-tittle', pizzeriaDataWith2Products.pizzeriaData.name)
    })

    it('results of pizzerias search sorted by most cheap does not includes pizzerias without products', async () => {
        const { pizzeriaData } = await registerPizzeriaWithAmountOfProducts(page, 0)

        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))

        await searchPizzerias(page, pizzeriaData.name)

        await page.click(orderByDropdownSelector)
        await page.select(orderByDropdownSelector, "MOST_CHEAP")

        await page.waitForTimeout(1000)
        const cardTitles = await page.$$('.card-body')

        expect(cardTitles).toHaveLength(0)
    })

})

