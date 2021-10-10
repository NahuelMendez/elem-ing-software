const puppeteer = require('puppeteer')
const {
    goto,
    expectPath,
    submitPizzeriaRegistration,
    submitConsumerRegistration,
    fillPizzeriaRegistrationForm,
    fillConsumerRegistrationForm,
    clickLink,
    chooseToRegisterAsPizzeria,
    chooseToRegisterAsConsumer,
    expectH1,
    expectTextContent,
    expectTextContents
} = require('./helpers/helpers')

const { createPizzeriaRegistrationData, createConsumerRegistrationData } = require('../test/testObjects')

jest.setTimeout(10000)
describe('Consumer registration', () => {
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

    it('when a user choose to register as a consumer, appears a consumer registration page', async () => {
        await goto(page, '/register')
        await chooseToRegisterAsConsumer(page)

        await expectH1(page, 'Registrarse en PizzApp como consumidor')
    })

    it('when a not registered consumer submits valid registration data, it is redirected to the login page', async () => {
        const consumerData = createConsumerRegistrationData({})
        await goto(page, '/register')
        await chooseToRegisterAsConsumer(page)

        await submitConsumerRegistration(page, consumerData)

        expectPath(page, '/login')
    })

    it('when the user click the login link in the consumer registration page, the browser is redirected to the login page', async () => {
        await goto(page, '/register')
        await chooseToRegisterAsConsumer(page)

        await clickLink(page, '/login')

        expectPath(page, '/login')
    })

    it(`when a consumers's password and confirmation password does not match, an error message is shown in the current page`, async () => {
        const consumerData = createConsumerRegistrationData({})
        await goto(page, '/register')
        await chooseToRegisterAsConsumer(page)

        await fillConsumerRegistrationForm(page, {...consumerData, confirmPassword: 'asdasdads'})

        await page.click('[type="submit"]', )
        await page.waitForSelector('#alertReg')

        await expectTextContent(page, '#alertReg', 'Passwords do not match')
        expectPath(page, '/register')
    })

    it(`a consumer cannot be registered with an email registered by another consumer`, async () => {
        const firstConsumerData = createConsumerRegistrationData({})
        await goto(page, '/register')
        await chooseToRegisterAsConsumer(page)
        await submitConsumerRegistration(page, firstConsumerData)

        const secondConsumerData = createConsumerRegistrationData({ email: firstConsumerData.email })
        await goto(page, '/register')
        await chooseToRegisterAsConsumer(page)
        await fillConsumerRegistrationForm(page, secondConsumerData)

        await page.click('[type="submit"]', )
        await page.waitForSelector('#alertReg')

        await expectTextContent(page, '#alertReg', `A user with email ${secondConsumerData.email} is already registered`)
        expectPath(page, '/register')
    })

    it(`a consumer cannot be registered with an email registered by a pizzeria`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        await goto(page, '/register')
        await chooseToRegisterAsPizzeria(page)
        await submitPizzeriaRegistration(page, pizzeriaData)

        const consumerData = createConsumerRegistrationData({ email: pizzeriaData.email })
        await goto(page, '/register')
        await chooseToRegisterAsConsumer(page)
        await fillConsumerRegistrationForm(page, consumerData)

        await page.click('[type="submit"]', )
        await page.waitForSelector('#alertReg')

        await expectTextContent(page, '#alertReg', `A user with email ${consumerData.email} is already registered`)
        expectPath(page, '/register')
    })

})
