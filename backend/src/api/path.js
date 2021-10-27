
const registerPath = '/api/register'

const loginPath = '/api/login'

const menuPath = '/api/pizzeria/:pizzeriaName/menu'

const pizzeriaPath = '/api/pizzeria/:pizzeriaName'

const searchPizzeriaPath = '/api/search/pizzeria'

const updateProductPath = '/api/pizzeria/:pizzeriaName/menu/:productName'

const orderPath = '/api/order'

module.exports = {
    registerPath, 
    menuPath, 
    loginPath, 
    pizzeriaPath,
    searchPizzeriaPath, 
    updateProductPath,
    orderPath
}
