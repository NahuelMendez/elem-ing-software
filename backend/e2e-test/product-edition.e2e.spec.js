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

const editProductFormConfirmButtonSelector = editProductModalFormSelector + ' button[type="submit"]'

const modalCloseButton = '.pizzap-modal .pizzap-modal-close-btn'

describe('Pizzeria product edition', () => {
    let browser
    let page

    beforeEach(async () => {
        browser = await puppeteer.launch({headless: false})
        page = await browser.newPage()
    })

    afterEach(async () => {
        await browser.close()
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

    it('when the close button of the modal edition form is clicked it is closed', async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})

        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, pizzaData)
        await goto(page, '/home')
        
        await page.waitForSelector(editProductButtonSelector)
        await page.click(editProductButtonSelector)

        await page.waitForSelector(editProductModalFormSelector)

        await page.click(modalCloseButton)


        const results = await page.$$eval(editProductModalFormSelector, elements => elements)
        expect(results).toEqual([])
    })

    it('given a modal form with edited fields when it is closed with the close button then no changes are made to the product', async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})

        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, pizzaData)
        await goto(page, '/home')

        const originalProductCard = await page.$eval('.card-container', element => element.innerHTML)
        
        await page.waitForSelector(editProductButtonSelector)
        await page.click(editProductButtonSelector)

        await page.waitForSelector(editProductModalFormSelector)

        await page.type(editProductFormNameSelector, 'aaa')
        await page.type(editProductFormDescriptionSelector, 'bbbb')
        await page.type(editProductFormPriceSelector, '9999')
        await page.type(editProductFormImageURLSelector, 'http://change.com/image.jpg')

        await page.click(modalCloseButton)

        const currentProductCard = await page.$eval('.card-container', element => element.innerHTML)
        expect(originalProductCard).toEqual(currentProductCard)
    })

    it('given a modal form with edited fields containing valid data when it is confirm then the product is updated', async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})

        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, pizzaData)
        await goto(page, '/home')
        
        await page.waitForSelector(editProductButtonSelector)
        await page.click(editProductButtonSelector)

        await page.waitForSelector(editProductModalFormSelector)

        await page.type(editProductFormNameSelector, "!!!")
        await page.type(editProductFormDescriptionSelector, "!!!")
        await page.type(editProductFormPriceSelector, '99')
        await page.type(editProductFormImageURLSelector, '.png')

        await page.click(editProductFormConfirmButtonSelector)
        await page.waitForNavigation('/home')

        await expectTextContent(page, '.card-tittle', pizzaData.name + '!!!')
        await expectTextContent(page, '.card-text', pizzaData.description + '!!!')
        await expectTextContent(page, 'p > b', pizzaData.price.toString() + '99')
    })

    it('given a modal form with a product name input containing the name of another existing product when it is submitted then the update fails with an error message', async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})
        const anotherPizzaData = createPizzaData({})

        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, pizzaData)
        await addProduct(page, anotherPizzaData)
        await goto(page, '/home')
        
        await page.waitForSelector(editProductButtonSelector)
        await page.click(editProductButtonSelector)

        await page.waitForSelector(editProductModalFormSelector)

        const nameField = await page.$(editProductFormNameSelector)
        nameField.value = ''

        await page.type(editProductFormNameSelector, anotherPizzaData.name)
        await page.click(editProductFormConfirmButtonSelector)
        
        await page.waitForSelector('.pizza-form-alert')
        await expectTextContent(page, '.pizza-form-alert', 'A menu cannot have repeated product names')
    })

})

async function expectInputValue(page, inputSelector, expectedValue) {
    const actualValue = await page.$eval(inputSelector, input => input.value)
    expect(actualValue).toEqual(expectedValue.toString())
}