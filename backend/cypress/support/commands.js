// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('visitRegister', () => {
    cy.visit('http://localhost:3000/register')
})

Cypress.Commands.add('registerPizzeria', ({ name, telephone, email, password, confirmPassword }) => {
    cy.get('input[placeholder="Nombre de usuario"]').type(name)
    cy.get('input[placeholder="Telefono"]').type(telephone)
    cy.get('input[placeholder="E-mail"]').type(email)
    cy.get('input[placeholder="Contraseña"]').type(password)
    cy.get('input[placeholder="Confirmar contraseña"]').type(password)
    cy.get('button[type="submit"]').click()
})

Cypress.Commands.add('pathShouldBe', expectedPath => {
    cy.location('pathname').should('eq', expectedPath)
})