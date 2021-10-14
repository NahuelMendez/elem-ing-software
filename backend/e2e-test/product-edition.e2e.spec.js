const puppeteer = require('puppeteer')
const {
    registerAsPizzeriaAndGoToMenu,
    addProduct,
    expectTextContent,
    goto
} = require('./helpers/helpers')

const { createPizzeriaRegistrationData, createPizzaData } = require('../test/testObjects')

jest.setTimeout(10000)

const editProductButtonSelector = '.card-container > div > .edit-product-btn > img'
const editProductModalFormSelector = '.pizzap-modal .edit-product-form'
const editProductFormNameSelector = editProductModalFormSelector + ' input[name="name"]'
const editProductFormDescriptionSelector = editProductModalFormSelector + ' input[name="description"]'
const editProductFormPriceSelector = editProductModalFormSelector + ' input[name="price"]'
const editProductFormImageURLSelector = editProductModalFormSelector + ' input[name="imageURL"]'

describe('Pizzeria product edition', () => {
    let browser
    let page

    beforeEach(async () => {
        browser = await puppeteer.launch({headless: false})
        page = await browser.newPage()
    })

    afterEach(async () => {
        //await browser.close()
    })

    it(`a product card on the home page of a pizzeria should have an edition button`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})

        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, pizzaData)
        await goto(page, '/home')

        await page.waitForSelector(editProductButtonSelector)
    })

    it('when the edition button of a product card is clicked should appear an edition modal form for the product', async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})

        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, pizzaData)
        await goto(page, '/home')
        await page.waitForSelector(editProductButtonSelector)

        await page.click(editProductButtonSelector)

        await page.waitForSelector(editProductModalFormSelector)
        
        await expectInputValue(page, editProductFormNameSelector, pizzaData.name)
        await expectInputValue(page, editProductFormDescriptionSelector, pizzaData.description)
        await expectInputValue(page, editProductFormPriceSelector, pizzaData.price)
        await expectInputValue(page, editProductFormImageURLSelector, pizzaData.imageURL)
    })

})

async function expectInputValue(page, inputSelector, expectedValue) {
    const actualValue = await page.$eval(inputSelector, input => input.value)
    expect(actualValue).toEqual(expectedValue.toString())
}