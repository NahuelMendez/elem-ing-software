const puppeteer = require('puppeteer')
const {
    goto,
    registerPizzeriaWithAmountOfProducts,
    expectTextContent,
    registerAndLoginConsumer,
    placeOrder,
    registerAndLoginPizzeria,
    expectPath
} = require('./helpers/helpers')

const { createConsumerRegistrationData } = require('../test/testObjects')

jest.setTimeout(30000)

describe('Consumidor - get ranking of most bought pizzas', () => {
    let browser
    let page

    beforeEach(async () => {
        browser = await puppeteer.launch({ headless: false })
        page = await browser.newPage()
    })

    afterEach(async () => {
        await browser.close()
    })

    it('when there are no products sold, a consumer should not see the ranking carousel in the main view', async () => {
        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))

        await goto(page, `/home`)

        const foundElements = await page.$$('[name="carousel-ranking"]')
        expect(foundElements).toHaveLength(0)
    })

    it(`when there is at least one bought product in the system, a consumer should see a carousel in the main view`, async () => {
        const { pizzeriaData } = await registerPizzeriaWithAmountOfProducts(page, 1)

        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))
        await goto(page, `/pizzeria/${pizzeriaData.name}`)

        await page.waitForSelector('.product-container .button-add > img')
        await page.click('.product-container .button-add > img')

        await page.waitForSelector('[name="confirm-button"]')
        await page.evaluate(() => document.querySelector('[name="confirm-button"]').click())

        await goto(page, `/home`)

        await page.waitForSelector('[name="carousel-ranking"]')
    })

    it(`each card in the carousel should show the name and image of the product, pizzeria name and its position in the ranking`, async () => {
        const { pizzeriaData, pizzasData } = await registerPizzeriaWithAmountOfProducts(page, 1)

        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))
        await placeOrder(page, { pizzeriaName: pizzeriaData.name, unitsOfProducts: 1 })

        await goto(page, `/home`)

        await page.waitForSelector('[name="carousel-ranking"]')

        await page.waitForSelector('[name="ranking-number"]')
        await expectTextContent(page, '[name="ranking-number"]', "1")

        await page.waitForSelector('[name="product-ranking-name"]')
        await page.waitForSelector('[name="product-ranking-pizzeriaName"]')
        await page.waitForSelector('[name="product-ranking-name"]')
        await page.waitForSelector('.ranking-image')

        await expectTextContent(page, '[name="product-ranking-pizzeriaName"]', pizzeriaData.name)

        const cardImage = await page.$$eval(
            'img.ranking-image',
            elements => elements.map(
                element => element.src)[0])          

        expect(cardImage).toEqual(pizzasData[0].imageURL)

        await expectTextContent(page, '[name="product-ranking-name"]', pizzasData[0].name)

    })

    it(`a maximum of 5 products are shown in a ranking`, async () => {
        const pizzeria1 = await registerPizzeriaWithAmountOfProducts(page, 1)
        const pizzeria2 = await registerPizzeriaWithAmountOfProducts(page, 1)
        const pizzeria3 = await registerPizzeriaWithAmountOfProducts(page, 1)
        const pizzeria4 = await registerPizzeriaWithAmountOfProducts(page, 1)
        const pizzeria5 = await registerPizzeriaWithAmountOfProducts(page, 1)
        const pizzeria6 = await registerPizzeriaWithAmountOfProducts(page, 1)

        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))
        await placeOrder(page, { pizzeriaName: pizzeria1.pizzeriaData.name, unitsOfProducts: 2 })
        await placeOrder(page, { pizzeriaName: pizzeria2.pizzeriaData.name, unitsOfProducts: 1 })
        await placeOrder(page, { pizzeriaName: pizzeria3.pizzeriaData.name, unitsOfProducts: 3 })
        await placeOrder(page, { pizzeriaName: pizzeria4.pizzeriaData.name, unitsOfProducts: 4 })
        await placeOrder(page, { pizzeriaName: pizzeria5.pizzeriaData.name, unitsOfProducts: 5 })
        await placeOrder(page, { pizzeriaName: pizzeria6.pizzeriaData.name, unitsOfProducts: 6 })

        await goto(page, `/home`)

        await page.waitForSelector('[name="carousel-ranking"]')

        await expectBestsellers(page, [
            { pizzeriaName: pizzeria6.pizzeriaData.name, productName: pizzeria6.pizzasData[0].name },
            { pizzeriaName: pizzeria5.pizzeriaData.name, productName: pizzeria5.pizzasData[0].name },
            { pizzeriaName: pizzeria4.pizzeriaData.name, productName: pizzeria4.pizzasData[0].name },
            { pizzeriaName: pizzeria3.pizzeriaData.name, productName: pizzeria3.pizzasData[0].name },
            { pizzeriaName: pizzeria1.pizzeriaData.name, productName: pizzeria1.pizzasData[0].name }
        ])
    })

    it(`when two products tie in sales, the order will be alphabetical`, async () => {
        const pizzeria1 = await registerPizzeriaWithAmountOfProducts(page, 1)
        const pizzeria2 = await registerPizzeriaWithAmountOfProducts(page, 1)
        const pizzeria3 = await registerPizzeriaWithAmountOfProducts(page, 1)

        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))
        await placeOrder(page, { pizzeriaName: pizzeria1.pizzeriaData.name, unitsOfProducts: 2 })
        await placeOrder(page, { pizzeriaName: pizzeria2.pizzeriaData.name, unitsOfProducts: 2 })
        await placeOrder(page, { pizzeriaName: pizzeria3.pizzeriaData.name, unitsOfProducts: 2 })

        await goto(page, `/home`)

        await page.waitForSelector('[name="carousel-ranking"]')

        const expectedBestsellersEntries = [
            { pizzeriaName: pizzeria1.pizzeriaData.name, productName: pizzeria1.pizzasData[0].name },
            { pizzeriaName: pizzeria2.pizzeriaData.name, productName: pizzeria2.pizzasData[0].name },
            { pizzeriaName: pizzeria3.pizzeriaData.name, productName: pizzeria3.pizzasData[0].name }
        ]

        await expectBestsellers(page, expectedBestsellersEntries)
    })

    it(`when an user clicks the ranking card product should redirect to the pizzeria order page`, async () => {
        const { pizzeriaData } = await registerPizzeriaWithAmountOfProducts(page, 1)

        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))
        await placeOrder(page, { pizzeriaName: pizzeriaData.name, unitsOfProducts: 1 })

        await goto(page, `/home`)

        await page.waitForSelector('[name="carousel-ranking"]')

        await page.waitForSelector('[name="ranking-number"]')
        await expectTextContent(page, '[name="ranking-number"]', "1")

        await page.waitForSelector('.ranking-card')
        await page.click('.ranking-card')

        expectPath(page, `/pizzeria/${pizzeriaData.name}`)

    })
})

async function findBestsellers(page) {
    await page.$$(".carousel-container .ranking-card")

    return page
        .$$(".carousel-container .ranking-card")
        .then(bestsellers =>
            Promise.all(
                bestsellers.map(bestseller =>
                    bestseller.evaluate(node => node.innerHTML))
            )
        )
}

async function expectBestsellers(page, expectedBestsellersEntries) {
    const bestsellersHTML = await findBestsellers(page)

    expect(bestsellersHTML).toHaveLength(expectedBestsellersEntries.length)

    bestsellersHTML.forEach((bestseller, index) => {
        expect(bestseller).toContain(expectedBestsellersEntries[index].pizzeriaName)
        expect(bestseller).toContain(expectedBestsellersEntries[index].productName)
    })
}