const puppeteer = require('puppeteer')
const {
    goto,
    expectTextContent,
    registerAndLoginConsumer,
    clickHomeCircularThing,
    expectPath
} = require('./helpers/helpers')

const { createConsumerRegistrationData } = require('../test/testObjects')

const ordersHistorySelector = '[name="orders-history"]'

jest.setTimeout(10000)

describe('Consumer - orders history', () => {
    let browser
    let page

    beforeEach(async () => {
        browser = await puppeteer.launch({headless: false})
        page = await browser.newPage()
    })
    
    afterEach(async () => {
        await browser.close()
    })

    it(`given a consumer that has not placed any order, when he goes to his profile page, it should have a message saying there are no orders yet`, async () => {
        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))
        await goto(page, `/profile`)

        await expectTextContent(page, ordersHistorySelector, 'Aun no realizaste pedidos');
    })

})