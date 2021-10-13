const puppeteer = require('puppeteer')
const {
    registerAsPizzeriaAndGoToMenu,
    addProduct,
    expectTextContent,
    goto
} = require('./helpers/helpers')

const { createPizzeriaRegistrationData, createPizzaData } = require('../test/testObjects')

jest.setTimeout(10000)

const editProductButtonSelector = '.card-container > div > .edit-product-btn > img'

describe('Pizzeria product edition', () => {
    let browser
    let page

    beforeEach(async () => {
        browser = await puppeteer.launch({headless: false})
        page = await browser.newPage()
    })

    afterEach(async () => {
        //await browser.close()
    })

    it(`a product card on the home page of a pizzeria should have an edition button`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})

        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, pizzaData)
        await goto(page, '/home')

        await page.waitForSelector(editProductButtonSelector)
    })

})  