const puppeteer = require('puppeteer')
const {
    goto,
    expectPath,
    submitPizzeriaRegistration,
    fillPizzeriaRegistrationForm,
    clickLink,
    chooseToRegisterAsPizzeria,
    chooseToRegisterAsConsumer,
    expectH1,
    expectTextContent,
    expectTextContents
} = require('./helpers/helpers')

const { createPizzeriaRegistrationData } = require('../test/testObjects')

describe('Pizzeria registration page', () => {
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

    it('provides two alternatives for registration', async () => {
        await goto(page, '/register')

        await expectTextContents(page, 'button', ['Como pizzeria', 'Como consumidor'])
    })

    it('when a user choose to register as a pizzeria, appears a pizzeria registration page', async () => {
        await goto(page, '/register')
        await chooseToRegisterAsPizzeria(page)

        await expectH1(page, 'Registrarse en PizzApp como pizzeria')
    })

    it('when a user choose to register as a consumer, appears a consumer registration page', async () => {
        await goto(page, '/register')
        await chooseToRegisterAsConsumer(page)

        await expectH1(page, 'Registrarse en PizzApp como consumidor')
    })

    it('when a not registered pizzeria submits valid pizzeria registration data, it is redirected to the login page', async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        await goto(page, '/register')
        await chooseToRegisterAsPizzeria(page)

        await submitPizzeriaRegistration(page, pizzeriaData)

        expectPath(page, '/login')
    })

    it('when the user click the login link in the pizzeria registration page, the browser is redirected to the login page', async () => {
        await goto(page, '/register')
        await chooseToRegisterAsPizzeria(page)

        await clickLink(page, '/login')

        expectPath(page, '/login')
    })

    it('when the user click the login link in the consumer registration page, the browser is redirected to the login page', async () => {
        await goto(page, '/register')
        await chooseToRegisterAsConsumer(page)

        await clickLink(page, '/login')

        expectPath(page, '/login')
    })

    it(`when a pizzeria's password and confirmation password does not match, an error message is shown in the current page`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        await goto(page, '/register')
        await chooseToRegisterAsPizzeria(page)

        await fillPizzeriaRegistrationForm(page, {...pizzeriaData, confirmPassword: 'asdasdads'})

        await page.click('[type="submit"]', )
        await page.waitForSelector('#alertReg')

        await expectTextContent(page, '#alertReg', 'Passwords do not match')
        expectPath(page, '/register')
    })

    it(`when a consumers's password and confirmation password does not match, an error message is shown in the current page`, async () => {
        const consumerData = createPizzeriaRegistrationData({})
        await goto(page, '/register')
        await chooseToRegisterAsConsumer(page)

        await fillPizzeriaRegistrationForm(page, {...consumerData, confirmPassword: 'asdasdads'})

        await page.click('[type="submit"]', )
        await page.waitForSelector('#alertReg')

        await expectTextContent(page, '#alertReg', 'Passwords do not match')
        expectPath(page, '/register')
    })

})
