const puppeteer = require('puppeteer')
const {
    registerAsPizzeriaAndGoToMenu,
    addProduct,
    expectTextContent,
    clickHomeCircularThing,
    goto,
    registerAndLoginConsumer,
    clickAndWait,
    submitLogin
} = require('./helpers/helpers')

const { createPizzeriaRegistrationData, createPizzaData, createConsumerRegistrationData } = require('../test/testObjects')
jest.setTimeout(15000)
describe('Pizzeria menu', () => {
    let browser
    let page

    beforeEach(async () => {
        browser = await puppeteer.launch({headless: false})
        //browser = await puppeteer.launch()
        page = await browser.newPage()
    })

    afterEach(async () => {
        await browser.close()
    })

    it(`a just created pizzeria that don't recieved orders should show no orders message on orders recieved page`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)

        await clickHomeCircularThing(page)
        await page.waitForSelector('a[name="go-to-orders"]')
        await page.click('a[name="go-to-orders"]')

        await expectTextContent(page, '[name="no-orders"]', `Todavia no recibiste pedidos.`)
    })

    it(`when a pizzeria recieve an order should show a table with the details of the order`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})
        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)

        await addProduct(page, pizzaData)
        const consumerData = createConsumerRegistrationData({})

        await registerAndLoginConsumer(page, consumerData)
        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')
       
        await page.waitForSelector('[name="confirm-button"]')
        await page.evaluate(() => document.querySelector('[name="confirm-button"]').click())

        await clickHomeCircularThing(page)
        await page.waitForSelector('[name="logout-button"]')
        await clickAndWait(page, '[name="logout-button"]')

        await submitLogin(page, { email: pizzeriaData.email, password: pizzeriaData.password })
        await goto(page, '/order')
        await page.waitForSelector('[name="orders-table"]')

        await expectTextContent(page, '[name="orders-table"]', consumerData.name)
        await expectTextContent(page, '[name="orders-table"]', pizzaData.price)
    })

    it(`when a pizzeria clicks de details button of orders table should show the details of that order`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})
        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)

        await addProduct(page, pizzaData)
        const consumerData = createConsumerRegistrationData({})

        await registerAndLoginConsumer(page, consumerData)
        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')
       
        await page.waitForSelector('[name="confirm-button"]')
        await page.evaluate(() => document.querySelector('[name="confirm-button"]').click())

        await clickHomeCircularThing(page)
        await page.waitForSelector('[name="logout-button"]')
        await clickAndWait(page, '[name="logout-button"]')

        await submitLogin(page, { email: pizzeriaData.email, password: pizzeriaData.password })
        await goto(page, '/order')
        await page.waitForSelector('[name="orders-table"]')

        await page.click('[name="order-detail-button"]')

        await page.waitForSelector('[name="order-detail"]')
        await page.click('[name="order-detail"]')

        await expectTextContent(page, '[name="orders-table"]', pizzaData.name)
        await expectTextContent(page, '[name="orders-table"]', pizzaData.price)
    })

    it(`when a pizzeria clicks de details button of orders table should show the details of that order`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})
        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)

        await addProduct(page, pizzaData)
        const consumerData = createConsumerRegistrationData({})

        await registerAndLoginConsumer(page, consumerData)
        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')
        await page.waitForSelector('[name="confirm-button"]')
        await page.evaluate(() => document.querySelector('[name="confirm-button"]').click())
        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')
        await page.waitForSelector('[name="confirm-button"]')
        await page.evaluate(() => document.querySelector('[name="confirm-button"]').click())

        await clickHomeCircularThing(page)
        await page.waitForSelector('[name="logout-button"]')
        await clickAndWait(page, '[name="logout-button"]')

        await submitLogin(page, { email: pizzeriaData.email, password: pizzeriaData.password })
        await goto(page, '/order')
        await page.waitForSelector('[name="orders-table"]')

        const productsData = await page.$$eval('[name="orders-recieved"] > * ', elements => elements.map(element => element.innerHTML))

        expect(productsData).toHaveLength(2)

        expect(productsData[0]).toContain(consumerData.name)
        expect(productsData[0]).toContain(consumerData.telephone)
        expect(productsData[0]).toContain(consumerData.email)
    })

})