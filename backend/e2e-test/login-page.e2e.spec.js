const puppeteer = require('puppeteer')

const {
    goto,
    clickLink,
    submitLogin,
    expectPath,
    registerPizzeria
} = require('./helpers/helpers')

const { createPizzeriaRegistrationData } = require('../test/testObjects')

jest.setTimeout(15000)

describe('Login page', () => {
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

    it('when a user in the login page click the link to register, it is redirected to the registration page', async () => {
        await goto(page, '/login')

        await clickLink(page, '/register')

        expectPath(page, '/register')
    })

    it('when a registered pizzeria login with his username and password, it is redirected to its home page', async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        await registerPizzeria(page, pizzeriaData)
        await goto(page, '/login')

        await submitLogin(page, pizzeriaData)

        expectPath(page, '/home')
    })

    it('when a registered pizzeria try to login with an invalid password, an error message is shown', async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        await registerPizzeria(page, pizzeriaData)

        await page.type('input[placeholder="E-mail"]', pizzeriaData.email)
        await page.type('input[placeholder="Contraseña"]', 'invalid password')
        await page.click('[type="submit"]')
        await page.waitForSelector('#alertReg')

        const message = await page.$eval('#alertReg', element => element.textContent)

        expect(message).toContain('El nombre de usuario y/o la contraseña no son correctos')
    })

    it('when a registered pizzeria try to login with invalid email, an error message is shown', async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        await registerPizzeria(page, pizzeriaData)

        await page.type('input[placeholder="E-mail"]', 'invalid@email.com')
        await page.type('input[placeholder="Contraseña"]', pizzeriaData.password)
        await page.click('[type="submit"]')
        await page.waitForSelector('#alertReg')

        const message = await page.$eval('#alertReg', element => element.textContent)

        expect(message).toContain('El nombre de usuario y/o la contraseña no son correctos')
    })

})