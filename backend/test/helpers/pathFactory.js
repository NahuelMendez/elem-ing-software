
const createMenuPath = (pizzeriaName) => `/api/pizzeria/${pizzeriaName}/menu`
const deleteProductPath = (pizzeriaName, productName) => `${createMenuPath(pizzeriaName)}/${productName}`

const createPizzeriaPath = (pizzeriaName) => `/api/pizzeria/${pizzeriaName}`
const createConsumerPath = (consumerName) => `/api/consumer/${consumerName}`

const createSearchPizzeriaPath = (partialName) => `/api/search/pizzeria?name=${partialName}`
const createUpdateProductPath = (pizzeriaName, productName) => `/api/pizzeria/${pizzeriaName}/menu/${productName}`

module.exports = {
    createMenuPath, 
    createPizzeriaPath,
    createConsumerPath,
    deleteProductPath, 
    createSearchPizzeriaPath, 
    createUpdateProductPath
}
