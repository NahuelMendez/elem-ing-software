
const registerPath = '/api/register'

const loginPath = '/api/login'

const createMenuPath = (pizzeriaName) => { return `/api/pizzeria/${pizzeriaName}/menu`}

const menuPath = '/api/pizzeria/:pizzeriaName/menu'


module.exports = {registerPath, createMenuPath, menuPath, loginPath}
