const puppeteer = require('puppeteer')
const {
    goto,
    registerAsPizzeriaAndGoToMenu,
    addProduct,
    expectTextContent
} = require('./helpers/helpers')

const { createPizzeriaRegistrationData, createPizzaData } = require('../test/testObjects')

describe('Consumidor - add product to notebook', () => {
    let browser
    let page

    beforeEach(async () => {
        browser = await puppeteer.launch({headless: false})
        page = await browser.newPage()
    })
    
    afterEach(async () => {
        await browser.close()
    })

    it(`when a user clicks the add button of a product card, an unit from that product is add to the notebook`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})
        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, pizzaData)
        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')

        await expectTextContent(page, '.notebook-container .name-product', pizzaData.name)
        await expectTextContent(page, '.notebook-container .price-product', pizzaData.price.toString())
        await expectTextContent(page, '.notebook-container .unit-product', "1")
        await expectTextContent(page, '.notebook-container .total', pizzaData.price.toString())
    })

    it(`when a user adds a product that already exists, product units are increased`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})
        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, pizzaData)
        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')

        await expectTextContent(page, '.notebook-container .name-product', pizzaData.name)
        await expectTextContent(page, '.notebook-container .price-product', pizzaData.price.toString())
        await expectTextContent(page, '.notebook-container .unit-product', "2")
    })

    it(`when a user adds a product, the total is modified`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})
        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, pizzaData)
        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')

        await expectTextContent(page, '.notebook-container .name-product', pizzaData.name)
        await expectTextContent(page, '.notebook-container .price-product', pizzaData.price.toString())
        await expectTextContent(page, '.notebook-container .total', (pizzaData.price * 2).toString())
    })

    it(`when there is no product add in then notebook, the total is 0`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})
        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, pizzaData)
        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector('.product-container .button-add > img')

        await expectTextContent(page, '.notebook-container .total', "0")
    })

})