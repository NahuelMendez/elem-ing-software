
const createMenuPath = (pizzeriaName) => { return `/api/pizzeria/${pizzeriaName}/menu`}

const createPizzeriaPath = (pizzeriaName) => { return `/api/pizzeria/${pizzeriaName}`}

module.exports = {createMenuPath, createPizzeriaPath}