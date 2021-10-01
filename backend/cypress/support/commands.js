// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('visitRegister', () => {
    cy.visit('http://localhost:3000/register')
})

Cypress.Commands.add('visitLogin', () => {
    cy.visit('http://localhost:3000/login')
})

Cypress.Commands.add('registerPizzeria', pizzeriaRegistrationData => {
    cy.visitRegister()
    cy.submitPizzeriaRegistration(pizzeriaRegistrationData)
})

Cypress.Commands.add('submitPizzeriaRegistration', ({ name, telephone, email, password, confirmPassword }) => {
    cy.get('input[name="name"]').type(name)
    cy.get('input[name="telephone"]').type(telephone)
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type(password)
    cy.get('input[name="confirmPassword"]').type(confirmPassword)
    cy.get('button[type="submit"]').click()
})

Cypress.Commands.add('submitLogin', ({ username, password, name }) => {
    cy.get('input[name="username"]').type(username || name) // TODO: emprolijar test
    cy.get('input[name="password"]').type(password)
    cy.get('button[type="submit"]').click()
})

Cypress.Commands.add('registerAndLoginPizzeria', pizzeriaRegistrationData => {
    cy.registerPizzeria(pizzeriaRegistrationData)
    cy.submitLogin(pizzeriaRegistrationData)
})

Cypress.Commands.add('clickHomeCircularThing', () => {
    cy.get('*[name="circular-thing"]').click()  // TODO: buscar buen nombre
})

Cypress.Commands.add('clickRegisterLink', () => {
    cy.contains('No tienes una cuenta? Registrate en PizzApp').click() // TODO: buscar con otro criterio
})

Cypress.Commands.add('logout', () => {
    cy.clickHomeCircularThing()
    cy.get('*[name="logout-button"]').click()
})

Cypress.Commands.add('goToEditMenu', () => {
    cy.clickHomeCircularThing()
    cy.get('*[name="edit-menu-button"]').click()
})

Cypress.Commands.add('addProduct', ({name, description,price, imageURL}) => {
    cy.get('input[name="name"]').type(name)
    cy.get('input[name="description"]').type(description)
    cy.get('input[name="price"]').type(price)
    cy.get('input[name="imageURL"]').type(imageURL)
    cy.get('*[type="submit"]').click()
})

Cypress.Commands.add('pathShouldBe', expectedPath => {
    cy.location('pathname').should('eq', expectedPath)
})