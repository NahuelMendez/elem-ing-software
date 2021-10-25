const puppeteer = require('puppeteer')
const {
    goto,
    expectTextContent,
    registerAndLoginConsumer,
    clickHomeCircularThing,
    expectPath
} = require('./helpers/helpers')

const { createConsumerRegistrationData } = require('../test/testObjects')

jest.setTimeout(10000)
describe('Consumer - profile data', () => {
    let browser
    let page

    beforeEach(async () => {
        browser = await puppeteer.launch({headless: false})
        page = await browser.newPage()
    })
    
    afterEach(async () => {
        await browser.close()
    })

    it(`When an consumer click de home circular button should appear Mi Perfil button`, async () => {
        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))
        await goto(page, `/home`)

        await clickHomeCircularThing(page)
        await page.waitForSelector('a[name="profile-button"]')
    })

    it(`When an consumer click de profile button should redirect to profile page`, async () => {
        const consumerData = createConsumerRegistrationData({});
        await registerAndLoginConsumer(page, consumerData);
        await goto(page, `/home`)

        await clickHomeCircularThing(page)

        await page.waitForSelector('a[name="profile-button"]')
        await page.click('a[name="profile-button"]')

        expectPath(page, '/profile')
    })

    it(`The profile page should show the logged consumer data`, async () => {
        const consumerData = createConsumerRegistrationData({});
        await registerAndLoginConsumer(page, consumerData);
        await goto(page, `/profile`)

        await page.waitForSelector('.cmr-info-dtl');

        await expectTextContent(page, '[name="consumer-name"]', consumerData.name);
        await expectTextContent(page, '[name="consumer-email"]', consumerData.email);
        await expectTextContent(page, '[name="consumer-telephone"]', consumerData.telephone.toString());
    })

})