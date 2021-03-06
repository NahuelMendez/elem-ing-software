const puppeteer = require('puppeteer')
const {
    registerPizzeria,
    registerAndLoginConsumer,
    expectTextContent,
    clickAndWait,
    expectPath
} = require('./helpers/helpers')

const { createPizzeriaRegistrationData, createConsumerRegistrationData } = require('../test/testObjects')

jest.setTimeout(40000)

const searchInputSelector = 'form > input[name="search-input"]'
const searchButtonSelector = 'button[name="search-action"]'

const pizzeriaCardContainerSelector = '#root > div  .flex-wrap'
const pizzeriaCardSelector = '.flex-wrap > a'

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

        expectPath(page, '/search')
    })

    it('when a user on his home page clicks the search icon without filling the search input nothing happens', async () => {
        const consumerData = createConsumerRegistrationData({})
        await registerAndLoginConsumer(page, consumerData)

        await page.waitForSelector(searchButtonSelector)
        await page.click(searchButtonSelector)

        expectPath(page, '/home')
    })

    it('when the entered partial name has no match with any pizzeria name, the page should have a message saying that there are no matches', async () => {
        const consumerData = createConsumerRegistrationData({})
        await registerAndLoginConsumer(page, consumerData)

        await page.type(searchInputSelector, 'name with no matches')
        await clickAndWait(page, searchButtonSelector)

        await expectTextContent(page, "p", 'No se encontraron pizzer??as que coincidan')
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
        await clickAndWait(page, searchButtonSelector)

        await page.waitForSelector(pizzeriaCardContainerSelector)
        await page.waitForSelector(pizzeriaCardSelector)

        const result = await page.$$eval(
            pizzeriaCardSelector,
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

    it('when a user enter a partial name that has some matches with pizzerias names, the page should have a card for each matching pizzeria containing its name and image', async () => {
        const pizzeriaRegistrationData = createPizzeriaRegistrationData({})
        await registerPizzeria(page, pizzeriaRegistrationData)

        const consumerData = createConsumerRegistrationData({})
        await registerAndLoginConsumer(page, consumerData)

        await page.type(searchInputSelector, pizzeriaRegistrationData.name)
        await clickAndWait(page, searchButtonSelector)
        await page.waitForSelector(pizzeriaCardContainerSelector)

        await clickAndWait(page, pizzeriaCardSelector)

        expectPath(page, '/pizzeria/' + pizzeriaRegistrationData.name)
    })


})