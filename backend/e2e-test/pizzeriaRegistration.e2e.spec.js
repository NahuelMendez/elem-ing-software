const puppeteer = require('puppeteer')
const {
    goto,
    clickAndWait,
    clickLink,
    submitLogin,
    expectPath,
    submitPizzeriaRegistration,
    registerPizzeria,
    registerAndLoginPizzeria,
    logoutPizzeria
} = require('./helpers/helpers')

const { createPizzeriaRegistrationData } = require('../test/testObjects')

describe('Pizzeria registration', () => {
    let browser
    let page

    beforeEach(async () => {
        //browser = await puppeteer.launch({headless: false})
        browser = await puppeteer.launch()
        page = await browser.newPage()
    })

    afterEach(async () => {
        browser.close()
    })


    it('when a user in the login page click the button to register, it is redirected to the registration page', async () => {
        await goto(page, '/login')

        await clickLink(page, '/register')

        expectPath(page, '/register')
    })

    it('when a not registered pizzeria submits valid registration data, it is redirected to the login page', async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        await goto(page, '/register')

        await submitPizzeriaRegistration(page, pizzeriaData)

        expectPath(page, '/login')
    })

    it('when a registered pizzeria login with his username and password, it is redirected to its home page', async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        await registerPizzeria(page, pizzeriaData)
        await goto(page, '/login')

        await submitLogin(page, pizzeriaData)

        expectPath(page, '/home')
    })

    it('when an authenticated pizzeria logout it is redirected to the login page', async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        await registerAndLoginPizzeria(page, pizzeriaData)

        await logoutPizzeria(page)

        expectPath(page, '/login')
    })

})