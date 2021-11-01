const puppeteer = require('puppeteer')
const {
    goto,
    registerAsPizzeriaAndGoToMenu,
    registerPizzeriaWithAmountOfProducts,
    addProduct,
    expectTextContent,
    registerAndLoginConsumer
} = require('./helpers/helpers')

const { createPizzeriaRegistrationData, createPizzaData, createConsumerRegistrationData, productsData } = require('../test/testObjects')

jest.setTimeout(15000)

describe('Consumidor - get ranking of most bought pizzas', () => {
    let browser
    let page

    beforeEach(async () => {
        browser = await puppeteer.launch({ headless: false })
        page = await browser.newPage()
    })

    afterEach(async () => {
        await browser.close()
    })

    it(`when there is at least one bought product in the system, a consumer should see a carousel in the main view`, async () => {
        const { pizzeriaData } = await registerPizzeriaWithAmountOfProducts(page, 1)

        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))
        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')

        await page.waitForSelector('[name="confirm-button"]')
        await page.evaluate(() => document.querySelector('[name="confirm-button"]').click())

        await goto(page, `/home`)

        await page.waitForSelector('[name="carousel-ranking"]')
    })

    it(`each card in the carousel should show the name of the product, pizzeria name and its position in the ranking`, async () => {
        const { pizzeriaData } = await registerPizzeriaWithAmountOfProducts(page, 6)

        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))
        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')

        await page.waitForSelector('[name="confirm-button"]')
        await page.evaluate(() => document.querySelector('[name="confirm-button"]').click())

        await goto(page, `/home`)

        await page.waitForSelector('[name="carousel-ranking"]')

        await page.waitForSelector('[name="ranking-number"]')
        await expectTextContent(page, '[name="ranking-number"]', "1")

        await page.waitForSelector('[name="product-ranking-name"]')

        await page.waitForSelector('[name="product-ranking-pizzeriaName"]')
        await expectTextContent(page, '[name="product-ranking-pizzeriaName"]', pizzeriaData.name)
    })

    it.only(`a maximum of 5 products are shown in a ranking`, async () => {
        const { pizzeriaData } = await registerPizzeriaWithAmountOfProducts(page, 6)

        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))
        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')

        await page.waitForSelector('[name="confirm-button"]')
        await page.evaluate(() => document.querySelector('[name="confirm-button"]').click())

        await goto(page, `/home`)

        await page.waitForSelector('[name="carousel-ranking"]')

        for (let index = 1; index < 6; index++) {

            await page.waitForSelector(`[name="ranking-number${index}"]`)
            await expectTextContent(page, `[name="ranking-number${index}"]`, index)
        }



        //await page.waitForSelector('[name="product-ranking-name"]')

        //await page.waitForSelector('[name="product-ranking-pizzeriaName"]')
        //await expectTextContent(page, '[name="product-ranking-pizzeriaName"]', pizzeriaData.name)
    })

    it('when there are no products sold, a consumer should not see the ranking carousel in the main view', async () => {
        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))

        await goto(page, `/home`)

        const foundElements = await page.$$('[name="carousel-ranking"]')
        expect(foundElements).toHaveLength(0)
    })
})