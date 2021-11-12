const puppeteer = require('puppeteer')
const {
    goto,
    registerAsPizzeriaAndGoToMenu,
    addProduct,
    expectTextContent
} = require('./helpers/helpers')

const { createPizzeriaRegistrationData, createPizzaData } = require('../test/testObjects')

jest.setTimeout(15000)

const deleteProductButton = '.card-container  .delete-product-btn'
const deleteProductButtonImg = deleteProductButton + ' > img'
const deleteProductModal = '.pizzap-modal [name="delete-product"]'
const modalAcceptButton = deleteProductModal + ' button[name="accept"]'

describe('Pizzeria - delete product from menu', () => {
    let browser
    let page

    beforeEach(async () => {
        browser = await puppeteer.launch({headless: false})
        page = await browser.newPage()
    })
    
    afterEach(async () => {
        await browser.close()
    })

    it(`when a pizzeria visits its home page, a delete button with an image should appear on any product card of the menu`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const firstProduct = createPizzaData({})
        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, firstProduct)
        await goto(page, '/home')

        await page.waitForSelector(deleteProductButtonImg)
    })

    it(`when a pizzeria clicks the delete button of a product card, a modal is shown asking if you want to delete a product`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})
        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, pizzaData)
        await goto(page, '/home')

        await page.waitForSelector(deleteProductButtonImg)
        await page.click(deleteProductButton)

        await page.waitForSelector(deleteProductModal)
        await expectTextContent(
            page, 
            deleteProductModal + ' h5[name="title"]', 
            '¿Esta seguro que quiere borrar el producto?'
        )
    })

    it(`when a pizzeria clicks the delete button of a product card, a modal appears and the accept button is selected, the product is removed from the menu`, async () => {
        const pizzeriaData = createPizzeriaRegistrationData({})
        const pizzaData = createPizzaData({})
        await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)
        await addProduct(page, pizzaData)
        await goto(page, '/home')

        await page.waitForSelector(deleteProductButtonImg)
        await page.click(deleteProductButton)

        await page.waitForSelector(deleteProductModal)
        await page.click(modalAcceptButton)

        const productCards = await page.$$eval('.card-container', element => element)
        
        expect(productCards).toHaveLength(0)
    })

})
