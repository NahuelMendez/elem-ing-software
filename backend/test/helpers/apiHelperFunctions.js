const {registerPath } = require("../../src/api/path")
const { createMenuPath, deleteProductPath } = require('../helpers/pathFactory')

async function registerPizzeria(requester, pizzeriaRegistrationData) {
    return await requester.post(registerPath).send(pizzeriaRegistrationData)
}

async function addProduct(requester, pizzeriaRegistrationData, productData) {
    return await requester.put(createMenuPath(pizzeriaRegistrationData.name)).send(productData)
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
    getMenu
}