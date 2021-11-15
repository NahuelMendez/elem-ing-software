const puppeteer = require('puppeteer')
const {
    goto,
    expectPath,
    registerAndLoginConsumer,
} = require('./helpers/helpers')

const { createConsumerRegistrationData } = require('../test/testObjects')

jest.setTimeout(15000)

describe('User - redirect', () => {
    let browser
    let page

    beforeEach(async () => {
        browser = await puppeteer.launch({headless: false})
        page = await browser.newPage()
    })
    
    afterEach(async () => {
        await browser.close()
    })

    it(`if a user goes to the main route without being logged in, it should be redirected to login page`, async () => {
        await goto(page, `/`)
        expectPath(page, '/login')
    })

    it(`if a logged in user goes to the main route, it should be redirected to home page`, async () => {
        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))
        await goto(page, `/`)
        expectPath(page, '/home')
    })
})