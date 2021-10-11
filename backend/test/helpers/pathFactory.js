
const createMenuPath = (pizzeriaName) => `/api/pizzeria/${pizzeriaName}/menu`
const deleteProductPath = (pizzeriaName, productName) => `${createMenuPath(pizzeriaName)}/${productName}`

const createPizzeriaPath = (pizzeriaName) => `/api/pizzeria/${pizzeriaName}`

const createSearchPizzeriaPath = (partialName) => `/api/search/pizzeria?name=${partialName}`

module.exports = {createMenuPath, createPizzeriaPath, deleteProductPath, createSearchPizzeriaPath}
