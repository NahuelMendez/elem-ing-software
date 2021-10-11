const puppeteer = require('puppeteer')
const {
    registerPizzeria,
    registerAndLoginConsumer,
    expectTextContent,
    clickAndWait,
    expectPath
} = require('./helpers/helpers')

const { createPizzeriaRegistrationData, createConsumerRegistrationData } = require('../test/testObjects')

jest.setTimeout(10000)

const searchInputSelector = 'form > input[name="search-input"]'
const searchButtonSelector = 'form > img[alt="search-icon"]'

describe('Pizzeria search by partial name', () => {
    let browser
    let page

    beforeEach(async () => {
        browser = await puppeteer.launch({headless: false})
        page = await browser.newPage()
    })

    afterEach(async () => {
        await browser.close()
    })

    it('a user home page should have a search bar on the header', async () => {
        const consumerData = createConsumerRegistrationData({})
        await registerAndLoginConsumer(page, consumerData)

        await page.waitForSelector(searchInputSelector)
        await page.waitForSelector(searchButtonSelector)
    })

    it('when a user on his home page clicks the search icon after filling the search input the browser is redirected to the search path', async () => {
        const consumerData = createConsumerRegistrationData({})
        await registerAndLoginConsumer(page, consumerData)

        await page.type(searchInputSelector, 'something')
        await clickAndWait(page, searchButtonSelector)

        expectPath(page, '/busquedas')
    })

    it('when the entered partial name has no match with any pizzeria name, the page should have a message saying that there are no matches', async () => {
        const consumerData = createConsumerRegistrationData({})
        await registerAndLoginConsumer(page, consumerData)

        await page.type(searchInputSelector, 'name with no matches')
        await clickAndWait(page, searchButtonSelector)

        await expectTextContent(page, "p", 'No se encontraron pizzerías que coincidan')
    })

    it('when a user enter a partial name that has some matches with pizzerias names, the page should have a card for each matching pizzeria containing its name and image', async () => {
        const kikoPizzaPizzeriaData = createPizzeriaRegistrationData({name: 'kiko pizza'})
        const kentukyPizzeriaData = createPizzeriaRegistrationData({name: 'kentuky'})
        const kePizzaPizzeriaData = createPizzeriaRegistrationData({name: 'ke pizza'})
        await registerPizzeria(page, kikoPizzaPizzeriaData)
        await registerPizzeria(page, kentukyPizzeriaData)
        await registerPizzeria(page, kePizzaPizzeriaData)

        const consumerData = createConsumerRegistrationData({})
        await registerAndLoginConsumer(page, consumerData)

        await page.type(searchInputSelector, 'ke')
        await page.click(searchButtonSelector)

        await page.waitForSelector('#root > div > .flex-wrap')

        const result = await page.$$eval(
            '#root > div > .flex-wrap > a',
            elements => elements.map(
                element => ({
                    imageURL: element.querySelector('div > img.pizzeria-img').src,
                    name: element.querySelector('.card-body').innerText
                })
            )
        )

        expect(result).toEqual([
            {
                imageURL: 'http://localhost:3000/static/media/generic-img.5eba155e.jpg',
                name: 'kentuky'
            },
            {
                imageURL: 'http://localhost:3000/static/media/generic-img.5eba155e.jpg',
                name: 'ke pizza'
            }
        ])
    })


})