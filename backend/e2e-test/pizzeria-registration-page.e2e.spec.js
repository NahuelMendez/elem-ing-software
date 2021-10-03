const puppeteer = require('puppeteer')
const {
    goto,
    expectPath,
    submitPizzeriaRegistration, clickLink
} = require('./helpers/helpers')

const { createPizzeriaRegistrationData } = require('../test/testObjects')

jest.setTimeout(20000)

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

    it('when a not registered pizzeria submits valid registration data, it is redirected to the login page', async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        await goto(page, '/register')

        await submitPizzeriaRegistration(page, pizzeriaData)

        expectPath(page, '/login')
    })

    it('when the user click the login link, the browser is redirected to the login page', async () => {
        await goto(page, '/register')

        await clickLink(page, '/login')

        expectPath(page, '/login')
    })

    it('when the password and confirmation password does not match, an error message is shown in the current page', async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        await goto(page, '/register')

        await page.type('input[name="name"]', pizzeriaData.name)
        await page.type('input[name="telephone"]', `${pizzeriaData.telephone}`)
        await page.type('input[name="email"]', pizzeriaData.email)
        await page.type('input[name="password"]', pizzeriaData.password)
        await page.type('input[name="confirmPassword"]', pizzeriaData.password + "!")

        await page.click('[type="submit"]', )
        await page.waitForSelector('#alertReg')

        const message = await page.$eval('#alertReg', element => element.textContent)

        expect(message).toContain('Passwords do not match')
        expectPath(page, '/register')
    })

})
