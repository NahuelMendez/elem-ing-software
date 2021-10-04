const puppeteer = require('puppeteer')
const {
    registerAsPizzeriaAndGoToMenu,
    addProduct,
    expectTextContent,
    goto
} = require('./helpers/helpers')

const { createPizzeriaRegistrationData, createPizzaData } = require('../test/testObjects')
jest.setTimeout(10000)
describe('Pizzeria menu', () => {
    let browser
    let page

    beforeEach(async () => {
        //browser = await puppeteer.launch({headless: false})
        browser = await puppeteer.launch()
        page = await browser.newPage()
    })

    afterEach(async () => {
        await browser.close()
    })

    it(`a just created pizzeria has no products on it's menu`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)

        const productsData = await page.$$eval('.card-container', elements => elements)

        expect(productsData).toHaveLength(0)
    })

    it(`when an authenticated pizzeria add a product to its menu, it appears on it's home page`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})
        pizzeriaData.name = 'pizzeria'
        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)

        await addProduct(page, pizzaData)

        await goto(page, '/home')

        const productsData = await page.$$eval('.card-container', elements => elements.map(element => element.innerHTML))

        expect(productsData).toHaveLength(1)

        expect(productsData[0]).toContain(pizzaData.name)
        expect(productsData[0]).toContain(pizzaData.description)
        expect(productsData[0]).toContain(pizzaData.price)
        expect(productsData[0]).toContain(pizzaData.imageURL)
    })

})