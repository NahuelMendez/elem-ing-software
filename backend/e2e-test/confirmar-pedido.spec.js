const puppeteer = require('puppeteer')
const {
    goto,
    registerAsPizzeriaAndGoToMenu,
    registerPizzeriaWithAmountOfProducts,
    addProduct,
    expectTextContent,
    registerAndLoginConsumer
} = require('./helpers/helpers')

const { createPizzeriaRegistrationData, createPizzaData, createConsumerRegistrationData } = require('../test/testObjects')

jest.setTimeout(15000)

describe('Consumidor - confirm order in notebook', () => {
    let browser
    let page

    beforeEach(async () => {
        browser = await puppeteer.launch({headless: false})
        page = await browser.newPage()
    })
    
    afterEach(async () => {
        await browser.close()
    })

    it(`a notebook with no products should not have a confirm button`, async () => {
        const { pizzeriaData } = await registerPizzeriaWithAmountOfProducts(page, 1)
        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))
        
        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        const foundElements = await page.$$('[name="confirm-button"]')
        expect(foundElements).toHaveLength(0)
    })

    it(`when a notebook has at least one product, a confirm button appears`, async () => {
        const { pizzeriaData } = await registerPizzeriaWithAmountOfProducts(page, 1)
        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))
        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')

        await page.waitForSelector('[name="confirm-button"]')
    })

    it(`when a user clicks the confirm button and its correct, a success message appears`, async () => {
        const { pizzeriaData } = await registerPizzeriaWithAmountOfProducts(page, 1)

        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))
        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')
       
        await page.waitForSelector('[name="confirm-button"]')
        await page.evaluate(() => document.querySelector('[name="confirm-button"]').click())

        await page.waitForSelector('.notebook-container .alert-confirm')
        await expectTextContent(page, '.notebook-container .alert-confirm > p', "Tú pedido fue confirmado")
    })

    it(`when a user clicks the confirm button and its successful, the products in the notebook dissapear`, async () => {
        const { pizzeriaData } = await registerPizzeriaWithAmountOfProducts(page, 1)
        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))
        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')
       
        await page.waitForSelector('[name="confirm-button"]')
        await page.evaluate(() => document.querySelector('[name="confirm-button"]').click())

        await page.waitForSelector('.notebook-container .alert-confirm')
        await expectTextContent(page, '.notebook-container .total', "0")
    })

})