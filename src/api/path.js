
const registerPath = '/api/register'

const createMenuCreatePath = (pizzeriaName) => { return `/api/pizzeria/${pizzeriaName}/menu`}

const menuCreatePath = '/api/pizzeria/:pizzeriaName/menu'


module.exports = {registerPath, createMenuCreatePath, menuCreatePath}