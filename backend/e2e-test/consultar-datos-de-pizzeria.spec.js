const puppeteer = require('puppeteer')
const {
    goto,
    registerPizzeria,
    expectTextContent,
    addProduct,
    registerAsPizzeriaAndGoToMenu
} = require('./helpers/helpers')

const { createPizzeriaRegistrationData, createPizzaData } = require('../test/testObjects')

describe('Pizzeria data visualization', () => {
    let browser
    let page

    beforeEach(async () => {
        browser = await puppeteer.launch({headless: false})
        page = await browser.newPage()
    })

    afterEach(async () => {
        await browser.close()
    })

    it('when a user visits the route /pizzeria/:pizzeria_name with the name of a registered pizzeria, the page should contain a default profile picture and that pizzeria info', async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        await registerPizzeria(page, pizzeriaData)

        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector('.pizz-info-image > img')
        await expectTextContent(page, '.pizz-info-dtl > ul > li:nth-child(1)', pizzeriaData.name)
        await expectTextContent(page, '.pizz-info-dtl > ul > li:nth-child(2)', pizzeriaData.telephone.toString())
        await expectTextContent(page, '.pizz-info-dtl > ul > li:nth-child(3)', pizzeriaData.email)
    })

    it('when a user visits the route /pizzeria/:pizzeria_name with the name of a not registered pizzeria, the page should contain an error message', async () => {
        await goto(page, `/pizzeria/NOT_REGISTERED_PIZZERIA_NAME`)

        await expectTextContent(page, '.error-piz-nf', 'No se encontro la pizzeria')
    })

    it('when a user visits the route /pizzeria/:pizzeria_name with the name of a registered pizzeria, but who doesnt have products, the page should show the not products found message', async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        await registerPizzeria(page, pizzeriaData)

        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await expectTextContent(page, '.not-found-products', 'No se ingresaron productos en el menú')
    })

    it('when a user visits the route /pizzeria/:pizzeria_name with the name of a registered pizzeria, the page should contain the info of the products wich offers', async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})
        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, pizzaData)

        await goto(page, `/pizzeria/${pizzeriaData.name}`)
        await page.waitForSelector('.card-container')
        const productsData = await page.$$eval('.card-container', elements => elements.map(element => element.innerHTML))

        expect(productsData).toHaveLength(1)

        expect(productsData[0]).toContain(pizzaData.name)
        expect(productsData[0]).toContain(pizzaData.description)
        expect(productsData[0]).toContain(pizzaData.price)
        expect(productsData[0]).toContain(pizzaData.imageURL)
    })

})