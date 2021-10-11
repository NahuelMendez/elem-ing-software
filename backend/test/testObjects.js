const {submitPizzeriaRegistration} = require("../e2e-test/helpers/helpers");
const generatePizzeriaName = () => `P${Date.now()}`

function createPizzeriaRegistrationData({name, telephone = 1112345678, email, password = 'pass123', confirmPassword}) {
    if (!name) name = generatePizzeriaName()
    if (!email) email = `${name}@d.c`
    if (!confirmPassword) confirmPassword = password

    return ({ name, telephone, email, password, confirmPassword })
}

function createPizzeriaRegistrationAPIData(properties) { // TODO: solucionar este parche. El front necesita "confirmPassword", pero la API se rompe si lo tiene
    const registrationData = createPizzeriaRegistrationData(properties)
    registrationData.confirmPassword = undefined
    return registrationData
}

const createConsumerRegistrationData = createPizzeriaRegistrationData

const generatePizzaName = () => `Pizza${Date.now()}`

function createPizzaData({name, description = 'pizza description', price = 1, imageURL = 'http://image.com/pizza.jpg'}) {
    if (!name) name = generatePizzaName()

    return ({name, description, price, imageURL})
}

const pizzeriasRegistrationData = {
    bancheroRegistrationData: {
        name: 'Banchero',
        telephone: 1112345678,
        email: 'banchero@gmail.com',
        password: 'password',
        rol: 'pizzeria'
    },

    guerrinRegistrationData: {
        name: 'Guerrin',
        telephone: 1112345678,
        email: 'guerrin@gmail.com',
        password: 'password',
        rol: 'pizzeria'
    }
}

const consumersRegistrationData = {
    kentRegistrationData: {
        name: 'Kent Beck',
        telephone: 1112345678,
        email: 'kent@gmail.com',
        password: 'password',
        rol: 'consumer'
    },

    martinRegistrationData: {
        name: 'Martin Fowler',
        telephone: 1112345678,
        email: 'martin@gmail.com',
        password: 'password',
        rol: 'consumer'
    }
}

const productsData = {
    mozzarella: {
        name : 'mozzarella',
        description : 'mozzarella description',
        price : 1,
        imageURL : 'http://img.com/product.jpg'
    },
    bacon: {
        name : 'bacon',
        description : 'bacon description',
        price : 1,
        imageURL : 'http://img.com/product.jpg'
    }
}

module.exports = {
    createPizzeriaRegistrationData,
    createConsumerRegistrationData,
    createPizzaData,
    createPizzeriaRegistrationAPIData,
    pizzeriasRegistrationData,
    consumersRegistrationData,
    productsData
}