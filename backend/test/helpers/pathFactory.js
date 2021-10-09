
const createMenuPath = (pizzeriaName) => `/api/pizzeria/${pizzeriaName}/menu`
const deleteProductPath = (pizzeriaName, productName) => `${createMenuPath(pizzeriaName)}/${productName}`

const createPizzeriaPath = (pizzeriaName) => { return `/api/pizzeria/${pizzeriaName}`}

module.exports = {createMenuPath, createPizzeriaPath, deleteProductPath}
