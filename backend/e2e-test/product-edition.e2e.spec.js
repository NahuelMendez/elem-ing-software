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
const editProductModalFormSelector = '.pizzap-modal [name="edit-product-form"]'
const nameInputSelector = editProductModalFormSelector + ' input[name="name"]'
const descriptionInputSelector = editProductModalFormSelector + ' input[name="description"]'
const priceInputSelector = editProductModalFormSelector + ' input[name="price"]'
const imageURLInputSelector = editProductModalFormSelector + ' input[name="imageURL"]'

const confirmButtonSelector = editProductModalFormSelector + ' button[type="submit"]'

const modalCloseButton = '.pizzap-modal [name="modal-close-btn"]'

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
        
        await expectInputValue(page, nameInputSelector, pizzaData.name)
        await expectInputValue(page, descriptionInputSelector, pizzaData.description)
        await expectInputValue(page, priceInputSelector, pizzaData.price)
        await expectInputValue(page, imageURLInputSelector, pizzaData.imageURL)
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

        await page.type(nameInputSelector, 'aaa')
        await page.type(descriptionInputSelector, 'bbbb')
        await page.type(priceInputSelector, '9999')
        await page.type(imageURLInputSelector, 'http://change.com/image.jpg')

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

        await page.type(nameInputSelector, "!!!")
        await page.type(descriptionInputSelector, "!!!")
        await page.type(priceInputSelector, '99')
        await page.type(imageURLInputSelector, '.png')

        await page.click(confirmButtonSelector)
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

        const nameField = await page.$(nameInputSelector)
        nameField.value = ''

        await page.type(nameInputSelector, anotherPizzaData.name)
        await page.click(confirmButtonSelector)
        
        await page.waitForSelector('[name="form-alert"]')
        await expectTextContent(page, '[name="form-alert"]', 'A menu cannot have repeated product names')
    })

    it('given a modal edition form with some empty input fields when a user submits the form then an error message indicating that the fields cannot be empty should appear', async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})

        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, pizzaData)
        await goto(page, '/home')
        
        await page.waitForSelector(editProductButtonSelector)
        await page.click(editProductButtonSelector)

        await page.waitForSelector(editProductModalFormSelector)

        
        const fieldSelectors = [
            nameInputSelector,
            descriptionInputSelector,
            priceInputSelector,
            imageURLInputSelector
        ]
        
        for(fieldSelector of fieldSelectors) {
            const inputField = await page.$(fieldSelector)
            await inputField.click({clickCount: 3})
            await inputField.press('Backspace')
        }
        
        await page.click(confirmButtonSelector)
        
        await page.waitForSelector('[name="input-error-message"]')
        const errorMessages = await page.$$eval('[name="input-error-message"]', elements => elements.map(element => element.innerText))
        
        expect(errorMessages).toContain('El nombre no puede estar vacio')
        expect(errorMessages).toContain('La descripcion no puede estar vacia')
        expect(errorMessages).toContain('El precio no puede estar vacio')
        expect(errorMessages).toContain('La URL de la imagen no puede estar vacia')
    })

})

async function expectInputValue(page, inputSelector, expectedValue) {
    const actualValue = await page.$eval(inputSelector, input => input.value)
    expect(actualValue).toEqual(expectedValue.toString())
}