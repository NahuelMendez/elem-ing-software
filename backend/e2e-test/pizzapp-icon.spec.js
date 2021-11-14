const puppeteer = require('puppeteer')

const {
    goto
} = require('./helpers/helpers')

jest.setTimeout(15000)

describe('Pizzapp icon', () => {
    let browser
    let page

    beforeEach(async () => {
        browser = await puppeteer.launch({headless: false})
        page = await browser.newPage()
    })

    afterEach(async () => {
        await browser.close()
    })

    it(`when enter a page of the application, the logo is displayed on the tab`, async () => {
        await goto(page, "/")
        await page.waitForSelector('[name="pizzaicon"]')
    })
})