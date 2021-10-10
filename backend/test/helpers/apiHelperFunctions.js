const {registerPath, loginPath } = require("../../src/api/path")
const { createMenuPath, deleteProductPath } = require('../helpers/pathFactory')

async function registerPizzeria(requester, pizzeriaRegistrationData) {
    return await requester.post(registerPath).send(pizzeriaRegistrationData)
}

async function login(requester, userData) {
    return await requester.post(loginPath).send({
        email: userData.email,
        password: userData.password
})}

async function addProduct(requester, pizzeriaRegistrationData, productData, token) {
    return await requester.put(createMenuPath(pizzeriaRegistrationData.name))
        .send(productData)
        .set('Authorization', token)
}

async function deleteProduct(requester, pizzeriaRegistrationData, pizzaData) {
    return await requester.delete(deleteProductPath(pizzeriaRegistrationData.name, pizzaData.name)).send()
}

async function getMenu(requester, pizzeriaRegistrationData) {
    return await requester.get(createMenuPath(pizzeriaRegistrationData.name))
}

module.exports = {
    registerPizzeria,
    addProduct,
    deleteProduct,
    getMenu,
    login
}