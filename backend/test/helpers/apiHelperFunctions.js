const {registerPath, loginPath, orderPath, consumerPath, rankingPath, pizzeriaOrdersPath} = require("../../src/api/path")

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

async function createOrder(requester, pizzeria, order, token) {
    return await requester.post(orderPath)
        .send({pizzeriaName: pizzeria.name, order: order})
        .set('Authorization', token)
}

async function getOrderHistory(requester, token) {
    return await requester.get(orderPath)
        .set('Authorization', token)
}

async function editConsumerData(requester, consumer, token) {
    return await requester.put(consumerPath)
            .send({name: consumer.name, email: consumer.email, telephone: consumer.telephone})
            .set('Authorization', token)
}

async function getConsumerData(requester, token) {
    return await requester.get(consumerPath)
        .set('Authorization', token)
}

async function getPizzeriaOrders(requester, token) {
    return await requester.get(pizzeriaOrdersPath)
        .set('Authorization', token)
}

async function getBestseller(requester) {
    return await requester.get(rankingPath)
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
    updatedProduct,
    createOrder,
    getOrderHistory,
    editConsumerData,
    getConsumerData,
    getBestseller,
    getPizzeriaOrders
}