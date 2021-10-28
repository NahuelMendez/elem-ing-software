const puppeteer = require('puppeteer')
const {
    goto,
    expectTextContent,
    registerAndLoginConsumer,
    registerPizzeriaWithAmountOfProducts,
} = require('./helpers/helpers')

const { createConsumerRegistrationData } = require('../test/testObjects')

const ordersHistorySelector = '[name="orders-history"]'
const addProductButtonSelector = '.product-container .button-add > img'

jest.setTimeout(15000)

describe('Consumer - orders history', () => {
    let browser
    let page

    beforeEach(async () => {
        browser = await puppeteer.launch({headless: true})
        page = await browser.newPage()
    })
    
    afterEach(async () => {
        await browser.close()
    })

    it(`given a consumer that has not placed any order, when he goes to his profile page, it should have a message saying there are no orders yet`, async () => {
        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))
        await goto(page, `/profile`)

        await expectTextContent(page, ordersHistorySelector, 'Aun no realizaste pedidos');
    })

    it(`given a consumer that has placed some orders, when he goes to his profile page, it should have a card for every placed order containing the pizzeria's name and the total price`, async () => {
        const { pizzeriaData, pizzasData: [pizzaData] } = await registerPizzeriaWithAmountOfProducts(page, 1)
  
        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))

        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector(addProductButtonSelector)
        await page.click(addProductButtonSelector)

        await page.waitForSelector('[name="confirm-button"]')
        await page.evaluate(() => document.querySelector('[name="confirm-button"]').click())
        await page.waitForSelector('.notebook-container .alert-confirm')

        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector(addProductButtonSelector)
        await page.click(addProductButtonSelector)
        await page.click(addProductButtonSelector)

        await page.waitForSelector('[name="confirm-button"]')
        await page.evaluate(() => document.querySelector('[name="confirm-button"]').click())
        await page.waitForSelector('.notebook-container .alert-confirm')

        await goto(page, `/profile`)

        await page.waitForSelector(ordersHistorySelector + ' ul > li')
        const ordersCards = await page.$$(ordersHistorySelector + ' ul > li')

        expect(ordersCards).toHaveLength(2)
        const nodesInnerHTML = await Promise.all([
            ordersCards[0].evaluate(node => node.innerHTML),
            ordersCards[1].evaluate(node => node.innerHTML)
        ])

        expect(nodesInnerHTML[0]).toContain(pizzeriaData.name)
        expect(nodesInnerHTML[0]).toContain(`${pizzaData.price}`)

        expect(nodesInnerHTML[1]).toContain(pizzeriaData.name)
        expect(nodesInnerHTML[1]).toContain(`${pizzaData.price}`)
    })

})