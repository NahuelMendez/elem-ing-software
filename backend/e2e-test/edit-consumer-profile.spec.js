const puppeteer = require('puppeteer')
const {
    goto,
    expectTextContent,
    registerAndLoginConsumer,
    clickHomeCircularThing,
    clickAndWait,
    clearInputField,
    expectPath
} = require('./helpers/helpers')

const { createConsumerRegistrationData } = require('../test/testObjects')

const editProfileFormSelector = '.pizzap-modal [name="edit-profile-form"]';
const inputUsernameEditProfileSelector = editProfileFormSelector + ' input[name="name"]';
const inputEmailEditProfileSelector = editProfileFormSelector + ' input[name="email"]';
const inputTelephoneEditProfileSelector = editProfileFormSelector + ' input[name="telephone"]';
const inputAddressEditProfileSelector = editProfileFormSelector + ' input[name="address"]';
const inputImageEditProfileSelector = editProfileFormSelector + ' input[name="image"]';
const confirmButtonSelector = editProfileFormSelector + ' button[type="submit"]';


jest.setTimeout(15000)
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
        await expectInputValue(page, inputTelephoneEditProfileSelector, consumerData.telephone);
        await expectInputValue(page, inputAddressEditProfileSelector, consumerData.address);
        await expectInputValue(page, inputImageEditProfileSelector, "");
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
        await page.type(inputAddressEditProfileSelector, "adsasdasdsd");
        await page.type(inputTelephoneEditProfileSelector, "12344321");
           
        await page.click('[name="modal-close-btn"]');

        await expectTextContent(page, '[name="consumer-name"]', consumerData.name);
        await expectTextContent(page, '[name="consumer-email"]', consumerData.email);
        await expectTextContent(page, '[name="consumer-telephone"]', consumerData.telephone.toString());
        await expectTextContent(page, '[name="consumer-address"]', consumerData.address.toString());
    })

    it(`When a consumer try to change his email for another that already exist should show a field with error`, async () => {
        const anotherConsumerData = createConsumerRegistrationData({});
        await registerAndLoginConsumer(page, anotherConsumerData);
        await clickHomeCircularThing(page)
        await page.waitForSelector('[name="logout-button"]')
        await clickAndWait(page, '[name="logout-button"]')

        const consumerData = createConsumerRegistrationData({});
        await registerAndLoginConsumer(page, consumerData);
        await goto(page, `/profile`)

        await page.waitForSelector('[name="edit-profile-button"]')
        await page.click('[name="edit-profile-button"]')

        await page.waitForSelector('.pizzap-modal');
        await clearInputField(page, inputEmailEditProfileSelector);
        await page.type(inputEmailEditProfileSelector, anotherConsumerData.email);
        await page.type(inputImageEditProfileSelector, "https://wallpaperaccess.com/full/2213424.jpg");
        await page.waitForSelector(confirmButtonSelector)
        await page.click(confirmButtonSelector);

        await page.waitForSelector('[name="form-alert"]');

        await expectTextContent(page, '[name="form-alert"]', "El email ya esta siendo usado")
    })

    it(`When a consumer update his data correctly, the modal close and should can see the updated personal info`, async () => {
        const consumerData = createConsumerRegistrationData({});
        await registerAndLoginConsumer(page, consumerData);
        await goto(page, `/profile`)

        await page.waitForSelector('[name="edit-profile-button"]')
        await page.click('[name="edit-profile-button"]')

        await page.waitForSelector(confirmButtonSelector);
        await clearInputField(page, inputEmailEditProfileSelector);
        await page.type(inputEmailEditProfileSelector, consumerData.name + "anotherEmail@gmail.com");
        await page.type(inputImageEditProfileSelector, "https://wallpaperaccess.com/full/2213424.jpg");
        await page.click(confirmButtonSelector);

        
        await goto(page, `/profile`)

        await expectTextContent(page, '[name="consumer-email"]', "Email: " + consumerData.name + "anotherEmail@gmail.com");
        await page.waitForSelector('img[src="https://wallpaperaccess.com/full/2213424.jpg"]');
    })

    it(`When a consumer update tries his data with an empty field, the modal should show an alert for empty field`, async () => {
        const consumerData = createConsumerRegistrationData({});
        await registerAndLoginConsumer(page, consumerData);
        await goto(page, `/profile`)

        await page.waitForSelector('[name="edit-profile-button"]')
        await page.click('[name="edit-profile-button"]')

        await page.waitForSelector(confirmButtonSelector);

        await clearInputField(page, inputUsernameEditProfileSelector);
        await page.type(inputUsernameEditProfileSelector, "");
        await clearInputField(page, inputEmailEditProfileSelector);
        await page.type(inputEmailEditProfileSelector, "");
        await clearInputField(page, inputTelephoneEditProfileSelector);
        await page.type(inputTelephoneEditProfileSelector, "");
        await clearInputField(page, inputAddressEditProfileSelector);
        await page.type(inputAddressEditProfileSelector, "");

        await page.click(confirmButtonSelector);

        await page.waitForSelector('.error-message-input')
        const errorMessages = await page.$$eval('.error-message-input', elements => elements.map(element => element.innerText))
        
        expect(errorMessages).toContain('El nombre de usuario no puede estar vacio')
        expect(errorMessages).toContain('El email no puede estar vacio')
        expect(errorMessages).toContain('El telefono no puede estar vacio')
        expect(errorMessages).toContain('La direccion no puede estar vacia')
        expect(errorMessages).toContain('La foto de perfil no puede estar vacia')
    })

})

async function expectInputValue(page, inputSelector, expectedValue) {
    const actualValue = await page.$eval(inputSelector, input => input.value)
    expect(actualValue).toEqual(expectedValue.toString())
}