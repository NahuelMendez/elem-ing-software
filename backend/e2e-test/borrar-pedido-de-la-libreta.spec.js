const puppeteer = require('puppeteer')
const {
    goto,
    registerAsPizzeriaAndGoToMenu,
    addProduct,
    expectTextContent
} = require('./helpers/helpers')

const { createPizzeriaRegistrationData, createPizzaData } = require('../test/testObjects')

jest.setTimeout(15000)
describe('Consumidor - delete product from notebook', () => {
    let browser
    let page

    beforeEach(async () => {
        browser = await puppeteer.launch({headless: false})
        page = await browser.newPage()
    })
    
    afterEach(async () => {
        await browser.close()
    })

    it(`when a user clicks the delete button next to a product, that product and all its units disappear from the notebook`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})
        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, pizzaData)
        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')

        await expectTextContent(page, '.notebook-container .name-product', pizzaData.name)
        await expectTextContent(page, '.notebook-container .unit-product', "1")

        await page.waitForSelector('[name="delete-product"]')
        await page.evaluate(() => document.querySelector('[name="delete-product"]').click())

        await expectTextContent(page, '.notebook-container .total', "0")
    })

    it(`when a consumer clicks the delete button next to a product on a notebook, total is modified`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})
        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, pizzaData)
        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')

        await expectTextContent(page, '.notebook-container .total', (pizzaData.price * 2).toString())

        await page.waitForSelector('[name="delete-product"]')
        await page.evaluate(() => document.querySelector('[name="delete-product"]').click())

        await expectTextContent(page, '.notebook-container .total', "0")
    })

})