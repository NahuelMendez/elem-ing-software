const puppeteer = require('puppeteer')
const {
    goto,
    registerAsPizzeriaAndGoToMenu,
    addProduct,
    expectTextContent
} = require('./helpers/helpers')

const { createPizzeriaRegistrationData, createPizzaData } = require('../test/testObjects')

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

    it(`when a notebook has at least one product, a confirm button appears`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})
        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, pizzaData)
        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')

        await page.waitForSelector('.notebook-container .confirm-button > button')
    })

    it(`when a user clicks the confirm button and its correct, a success message appears`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})
        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, pizzaData)
        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')
       
        await page.waitForSelector('.notebook-container .confirm-button > button')
        await page.click('.notebook-container .confirm-button > button')

        await page.waitForSelector('.notebook-container .alert-confirm')
        await expectTextContent(page, '.notebook-container .alert-confirm > p', "Tú pedido fue confirmado")
    })

    it(`when a user clicks the confirm button and its successful, the products in the notebook dissapear`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})
        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, pizzaData)
        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')
       
        await page.waitForSelector('.notebook-container .confirm-button > button')
        await page.click('.notebook-container .confirm-button > button')

        await page.waitForSelector('.notebook-container .alert-confirm')
        await expectTextContent(page, '.notebook-container .alert-confirm > p', "Tú pedido fue confirmado")
        await expectTextContent(page, '.notebook-container .total', "0")
    })

})