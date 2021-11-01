const puppeteer = require('puppeteer')
const {
    goto,
    expectTextContent,
    registerAndLoginConsumer,
    registerPizzeriaWithAmountOfProducts,
    placeOrder,
} = require('./helpers/helpers')

const { createConsumerRegistrationData } = require('../test/testObjects')

const ordersHistorySelector = '[name="orders-history"]'

jest.setTimeout(15000)

describe('Consumer - orders history', () => {
    let browser
    let page

    beforeEach(async () => {
        browser = await puppeteer.launch({headless: false})
        page = await browser.newPage()
    })
    
    afterEach(async () => {
        await browser.close()
    })

    it(`given a consumer that has not placed any order, when he goes to his profile page, it should have a message saying there are no orders yet`, async () => {
        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))
        await goto(page, `/profile`)

        await expectTextContent(page, ordersHistorySelector, 'Aun no realizaste pedidos');
    })

    it(`given a consumer that has placed some orders, when he goes to his profile page, it should have a card for every placed order containing the pizzeria's name and the total price`, async () => {
        const { pizzeriaData, pizzasData: [pizzaData] } = await registerPizzeriaWithAmountOfProducts(page, 1)
  
        await registerAndLoginConsumer(page, createConsumerRegistrationData({}))

        await placeOrder(page, { pizzeriaName: pizzeriaData.name, unitsOfProducts: 1 })
        await placeOrder(page, { pizzeriaName: pizzeriaData.name, unitsOfProducts: 2 })

        await goto(page, `/profile`)

        await expectOrdersHistoryItems(page, [
            { pizzeriaName: pizzeriaData.name, total: pizzaData.price },
            { pizzeriaName: pizzeriaData.name, total: pizzaData.price * 2 }
        ])
    })

})

async function findOrdersListItems(page) {
    await page.waitForSelector(ordersHistorySelector + ' ul > li')

    return page
            .$$(ordersHistorySelector + ' ul > li')
            .then(ordersListItems =>
                Promise.all(
                    ordersListItems.map(orderListItem =>
                        orderListItem.evaluate(node => node.innerHTML))
                )
            )
}

async function expectOrdersHistoryItems(page, expectedOrdersHistoryEntries) {
    const ordersListItemsHTML = await findOrdersListItems(page)

    expect(ordersListItemsHTML).toHaveLength(expectedOrdersHistoryEntries.length)

    ordersListItemsHTML.forEach((orderHistoryItem, index) => {
        expect(orderHistoryItem).toContain(expectedOrdersHistoryEntries[index].pizzeriaName)
        expect(orderHistoryItem).toContain(`${expectedOrdersHistoryEntries[index].total}`)    
    })
}