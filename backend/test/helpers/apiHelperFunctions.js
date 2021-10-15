const {registerPath, loginPath } = require("../../src/api/path")

const { 
    createMenuPath, 
    deleteProductPath, 
    createPizzeriaPath, 
    createUpdateProductPath 
} = require('../helpers/pathFactory')

async function registerUser(requester, pizzeriaRegistrationData) {
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

async function getPizzeria(requester, pizzeriaRegistrationData) {
    return await requester.get(createPizzeriaPath(pizzeriaRegistrationData.name))
}

async function updatedProduct(requester, pizzeria, productToUpdate, product, token) {
    return await requester.put(createUpdateProductPath(pizzeria.name, productToUpdate.name))
        .send(product)
        .set('Authorization', token)
}

async function loginToken(requester, user) {
    await registerUser(requester, user)
    const responseLogin = await login(requester, {
        email: user.email,
        password: user.password
    })
    return responseLogin.get('Authorization')
}

module.exports = {
    registerUser,
    addProduct,
    deleteProduct,
    getMenu,
    login,
    getPizzeria,
    loginToken,
    updatedProduct
}