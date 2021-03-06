
const registerPath = '/api/register'

const loginPath = '/api/login'

const menuPath = '/api/pizzeria/:pizzeriaName/menu'

const pizzeriaPath = '/api/pizzeria/:pizzeriaName'

const searchPizzeriaPath = '/api/search/pizzeria'

const updateProductPath = '/api/pizzeria/:pizzeriaName/menu/:productName'

const orderPath = '/api/order'

const rankingPath = '/api/order/bestseller'

const consumerPath = '/api/consumer'

const pizzeriaOrdersPath = '/api/pizzeria/order'

module.exports = {
    registerPath, 
    menuPath, 
    loginPath, 
    pizzeriaPath,
    searchPizzeriaPath, 
    updateProductPath,
    orderPath,
    consumerPath,
    rankingPath,
    pizzeriaOrdersPath
}
