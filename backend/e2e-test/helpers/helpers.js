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

async function submitPizzeriaRegistration(page, { name, telephone, email, password, confirmPassword }) {
    await page.type('input[name="name"]', name)
    await page.type('input[name="telephone"]', `${telephone}`)
    await page.type('input[name="email"]', email)
    await page.type('input[name="password"]', password)
    await page.type('input[name="confirmPassword"]', confirmPassword)

    await clickSubmit(page)
}

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
    await submitPizzeriaRegistration(page, pizzeriaRegistrationData)
}

async function registerAndLoginPizzeria(page, pizzeriaRegistrationData) {
    await registerPizzeria(page, pizzeriaRegistrationData)
    await submitLogin(page, pizzeriaRegistrationData)
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

async function addProduct(page, { name, description, price, imageURL }) {
    await page.type('input[name="name"]', name)
    await page.type('input[name="description"]', description)
    await page.type('input[name="price"]', `${price}`)
    await page.type('input[name="imageURL"]', imageURL)

    // await Promise.all([
    //     page.click('*[type="submit"]'),
    //     page.waitForResponse()
    // ])
    await page.click('[type="submit"]')
    await page.waitForSelector('[name="submited-product-message"]')
}

module.exports = {
    goto,
    clickAndWait,
    clickLink,
    submitLogin,
    expectPath,
    submitPizzeriaRegistration,
    clickHomeCircularThing,
    registerPizzeria,
    registerAndLoginPizzeria,
    logoutPizzeria,
    goToMenuForPizzeria,
    registerAsPizzeriaAndGoToMenu,
    addProduct
}