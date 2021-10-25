
const registerPath = '/api/register'

const loginPath = '/api/login'

const menuPath = '/api/pizzeria/:pizzeriaName/menu'

const consumerPath = '/api/consumer/:consumerName'

const pizzeriaPath = '/api/pizzeria/:pizzeriaName'

const searchPizzeriaPath = '/api/search/pizzeria'

const updateProductPath = '/api/pizzeria/:pizzeriaName/menu/:productName'

const createOrderPath = '/api/order'

module.exports = {
    registerPath, 
    menuPath, 
    loginPath, 
    pizzeriaPath, 
    consumerPath, 
    searchPizzeriaPath, 
    updateProductPath,
    createOrderPath
}
