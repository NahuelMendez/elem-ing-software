const puppeteer = require('puppeteer')
const {
    goto,
    expectTextContent,
    registerAndLoginConsumer,
    clickHomeCircularThing,
    expectPath
} = require('./helpers/helpers')

const { createConsumerRegistrationData } = require('../test/testObjects')

const editProfileFormSelector = '.pizzap-modal [name="edit-profile-form"]';
const inputUsernameEditProfileSelector = editProfileFormSelector + ' input[name="username"]';
const inputEmailEditProfileSelector = editProfileFormSelector + ' input[name="email"]';
const inputTelephoneEditProfileSelector = editProfileFormSelector + ' input[name="telephone"]';


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

    it(`When an consumer click the home edit profile button should appear a form with the user data`, async () => {
        const consumerData = createConsumerRegistrationData({});
        await registerAndLoginConsumer(page, consumerData)
        await goto(page, `/home`)

        await clickHomeCircularThing(page)
        await page.waitForSelector('a[name="profile-button"]')
        await page.click('a[name="profile-button"]')

        await page.waitForSelector('[name="edit-profile-button"]')
        await page.click('[name="edit-profile-button"]')

        await page.waitForSelector(editProfileFormSelector)
        await expectInputValue(page, inputUsernameEditProfileSelector, consumerData.name);
        await expectInputValue(page, inputEmailEditProfileSelector, consumerData.email);
        await expectInputValue(page, inputTelephoneEditProfileSelector, consumerData.telephone)
    })

    it(`When a cosumer edit the profile form and close the modal, then his personal data shouldn't be changed`, async () => {
        const consumerData = createConsumerRegistrationData({});
        await registerAndLoginConsumer(page, consumerData);
        await goto(page, `/profile`)

        await page.waitForSelector('[name="edit-profile-button"]')
        await page.click('[name="edit-profile-button"]')

        await page.waitForSelector('.pizzap-modal [name="modal-close-btn"]');
        await page.type(inputUsernameEditProfileSelector, "abcd");
        await page.type(inputEmailEditProfileSelector, "abcd@gmail.com");
        await page.type(inputTelephoneEditProfileSelector, "12344321");
           
        await page.click('[name="modal-close-btn"]');

        await expectTextContent(page, '[name="consumer-name"]', consumerData.name);
        await expectTextContent(page, '[name="consumer-email"]', consumerData.email);
        await expectTextContent(page, '[name="consumer-telephone"]', consumerData.telephone.toString());
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

async function expectInputValue(page, inputSelector, expectedValue) {
    const actualValue = await page.$eval(inputSelector, input => input.value)
    expect(actualValue).toEqual(expectedValue.toString())
}