
const registerPath = '/api/register'

const loginPath = '/api/login'

const createMenuCreatePath = (pizzeriaName) => { return `/api/pizzeria/${pizzeriaName}/menu`}

const menuCreatePath = '/api/pizzeria/:pizzeriaName/menu'


module.exports = {registerPath, createMenuCreatePath, menuCreatePath, loginPath}
