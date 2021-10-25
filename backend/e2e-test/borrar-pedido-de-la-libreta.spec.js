const puppeteer = require('puppeteer')
const {
    goto,
    registerAsPizzeriaAndGoToMenu,
    addProduct,
    expectTextContent
} = require('./helpers/helpers')

const { createPizzeriaRegistrationData, createPizzaData } = require('../test/testObjects')

jest.setTimeout(10000)
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

    it.only(`when a user clicks the delete button next to a product, that product and all its units disappear from the notebook`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})
        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, pizzaData)
        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')

        await page.waitForSelector('.notebook-container .delete-product > img')
        await page.click('.notebook-container .delete-product > img')

        await expectTextContent(page, '.notebook-container .total', "0")
    })

    it(`when a user clicks the delete button next to a product, total is modified`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})
        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, pizzaData)
        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')

        await expectTextContent(page, '.notebook-container .total', (pizzaData.price * 2).toString())

        await page.waitForSelector('.notebook-container .delete-product > img')
        await page.click('.notebook-container .delete-product > img')

        await expectTextContent(page, '.notebook-container .total', "0")
    })

})