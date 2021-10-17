const { createPizzeriaRegistrationData, createPizzaData } = require('../../test/testObjects')

async function goto(page, path) {
    await page.goto('http://localhost:3000' + path)
}

async function clickAndWait(page, selector) {
    await Promise.all([page.click(selector), page.waitForNavigation()])
}

async function clickLink(page, path) {
    await clickAndWait(page, `[href="${path}"]`)
}

async function clickSubmit(page) {
    await clickAndWait(page, 'button[type="submit"]')
}

async function submitPizzeriaRegistration(page, formData) {
    await fillPizzeriaRegistrationForm(page, formData)

    await clickSubmit(page)
}

const submitConsumerRegistration = submitPizzeriaRegistration

async function fillPizzeriaRegistrationForm(page, { name, telephone, email, password, confirmPassword }) {
    await page.type('input[name="name"]', name)
    await page.type('input[name="telephone"]', `${telephone}`)
    await page.type('input[name="email"]', email)
    await page.type('input[name="password"]', password)
    await page.type('input[name="confirmPassword"]', confirmPassword)
}

const fillConsumerRegistrationForm = fillPizzeriaRegistrationForm

async function submitLogin(page, { email, password }) {
    await page.type('input[placeholder="E-mail"]', email) // TODO: arreglar cuando se corrija el frontend
    await page.type('input[placeholder="Contraseña"]', password)

    await clickSubmit(page)
}

function expectPath(page, path) {
    expect(page.url()).toEqual('http://localhost:3000' + path)
}

async function clickHomeCircularThing(page) {
    await page.click('.rounded-full')
}

// Complex tasks
async function registerPizzeria(page, pizzeriaRegistrationData) {
    await goto(page, '/register')
    await chooseToRegisterAsPizzeria(page)
    await submitPizzeriaRegistration(page, pizzeriaRegistrationData)
}

async function registerAndLoginPizzeria(page, pizzeriaRegistrationData) {
    await registerPizzeria(page, pizzeriaRegistrationData)
    await submitLogin(page, pizzeriaRegistrationData)
}

async function registerAndLoginConsumer(page, consumerRegistrationData) {
    await goto(page, '/register')
    await chooseToRegisterAsConsumer(page)
    await submitConsumerRegistration(page, consumerRegistrationData)
    await submitLogin(page, consumerRegistrationData)
}

async function logoutPizzeria(page) {
    await clickHomeCircularThing(page)
    await page.waitForSelector('[name="logout-button"]')
    await clickAndWait(page, '[name="logout-button"]')
}

async function goToMenuForPizzeria(page) {
    await clickHomeCircularThing(page)
    await page.waitForSelector('[name="go-to-menu"]')
    await clickAndWait(page, '[name="go-to-menu"]')
}

async function registerAsPizzeriaAndGoToMenu(page, pizzeriaData) {
    await registerAndLoginPizzeria(page, pizzeriaData)
    await goToMenuForPizzeria(page)
}

async function registerPizzeriaWithAmountOfProducts(page, amountOfProducts) {
    const pizzeriaData = createPizzeriaRegistrationData({})
    const pizzasData = Array.from(Array(amountOfProducts)).map(() => createPizzaData({}))

    await registerAsPizzeriaAndGoToMenu(page, pizzeriaData)

    for (let pizzaData of pizzasData) {
        await addProduct(page, pizzaData)
    }

    return { pizzeriaData, pizzasData }
}

async function registerPizzeriaWithOneProductAndGoToHome(page) {
    const { pizzeriaData, pizzasData } = await registerPizzeriaWithAmountOfProductsAndGoToHome(page, 1)
    return { pizzeriaData, pizzaData: pizzasData[0] }
}

async function registerPizzeriaWithAmountOfProductsAndGoToHome(page, amountOfProducts) {
    const { pizzeriaData, pizzasData } = await registerPizzeriaWithAmountOfProducts(page, amountOfProducts)
    await goto(page, '/home')

    return { pizzeriaData, pizzasData }
}

async function addProduct(page, { name, description, price, imageURL }) {
    await page.type('input[name="name"]', name)
    await page.type('input[name="description"]', description)
    await page.type('input[name="price"]', `${price}`)
    await page.type('input[name="imageURL"]', imageURL)

    await page.click('[type="submit"]')
    await page.waitForSelector('[name="submited-product-message"]')
}

async function chooseToRegisterAsPizzeria(page) {
    await page.click('button:nth-child(1)')
    await page.waitForSelector('h1')
}

async function chooseToRegisterAsConsumer(page) {
    await page.click('button:nth-child(2)')
    await page.waitForSelector('h1')
}

async function expectH1(page, expectedText) {
    const titleText = await page.$eval('h1', h1 => h1.textContent)

    expect(titleText).toBe(expectedText)
}

async function expectTextContent(page, selector, expectedTextContent) {
    const message = await page.$eval(selector, element => element.textContent)
    expect(message).toContain(expectedTextContent)
}

async function expectTextContents(page, selector, expectedTextContents) {
    const textContents = await page.$$eval(selector, elements => elements.map(element => element.textContent))
    expect(textContents).toEqual(expectedTextContents)
}

async function clearInputFields(page, inputFieldsSelectors) {
    for(let inputFieldSelector of inputFieldsSelectors) {
        await clearInputField(page, inputFieldSelector)
    }
}

async function clearInputField(page, inputFieldSelector) {
    const inputField = await page.$(inputFieldSelector)
    await inputField.click({clickCount: 3})
    await inputField.press('Backspace')
}

module.exports = {
    goto,
    clickAndWait,
    clickLink,
    submitLogin,
    expectPath,
    submitPizzeriaRegistration,
    submitConsumerRegistration,
    clickHomeCircularThing,
    registerPizzeria,
    registerAndLoginPizzeria,
    registerPizzeriaWithAmountOfProducts,
    registerPizzeriaWithOneProductAndGoToHome,
    registerPizzeriaWithAmountOfProductsAndGoToHome,
    registerAndLoginConsumer,
    fillPizzeriaRegistrationForm,
    fillConsumerRegistrationForm,
    logoutPizzeria,
    goToMenuForPizzeria,
    registerAsPizzeriaAndGoToMenu,
    addProduct,
    chooseToRegisterAsPizzeria,
    chooseToRegisterAsConsumer,
    expectH1,
    expectTextContent,
    expectTextContents,
    clearInputFields,
    clearInputField
}