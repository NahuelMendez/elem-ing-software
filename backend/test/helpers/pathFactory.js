
const createMenuPath = (pizzeriaName) => `/api/pizzeria/${pizzeriaName}/menu`
const deleteProductPath = (pizzeriaName, productName) => `${createMenuPath(pizzeriaName)}/${productName}`

module.exports = {createMenuPath, deleteProductPath}