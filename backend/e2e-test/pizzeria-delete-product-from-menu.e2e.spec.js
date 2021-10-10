const puppeteer = require('puppeteer')
const {
    goto,
    registerAsPizzeriaAndGoToMenu,
    addProduct
} = require('./helpers/helpers')

const { createPizzeriaRegistrationData, createPizzaData } = require('../test/testObjects')

jest.setTimeout(10000)

describe('Pizzeria - delete product from menu', () => {
    let browser
    let page

    beforeEach(async () => {
        browser = await puppeteer.launch({headless: false})
        page = await browser.newPage()
    })
    
    afterEach(async () => {
        await browser.close()
    })

    it(`when a pizzeria visits its home page, a delete button with an image should appear on any product card of the menu`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const firstProduct = createPizzaData({})
        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, firstProduct)
        await goto(page, '/home')

        await page.waitForSelector('.card-container > .delete-product-btn > img')
    })

    it(`when a pizzeria clicks the delete button of a product card, the product is removed from the menu`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})
        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, pizzaData)
        await goto(page, '/home')

        await page.waitForSelector('.card-container > .delete-product-btn > img')
        await page.click('.card-container > .delete-product-btn > img')

        const productCards = await page.$$eval('.card-container', element => element)
        
        expect(productCards).toHaveLength(0)
    })

})
