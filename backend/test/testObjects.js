const {submitPizzeriaRegistration} = require("../e2e-test/helpers/helpers");
const generatePizzeriaName = () => `P${Date.now()}`

function createPizzeriaRegistrationData({name, telephone = 1112345678, email, address = 'Calle False 123, Bs. As.', password = 'pass123', confirmPassword}) {
    if (!name) name = generatePizzeriaName()
    if (!email) email = `${name.replace(" ", "_")}@d.c`
    if (!confirmPassword) confirmPassword = password

    return ({ name, telephone, email, address, password, confirmPassword })
}

function createPizzeriaRegistrationAPIData(properties) { 
    const registrationData = createPizzeriaRegistrationData(properties)
    registrationData.confirmPassword = undefined
    return registrationData
}

const createConsumerRegistrationData = createPizzeriaRegistrationData

const generatePizzaName = () => `P${Date.now()}`.slice(0,10)

function createPizzaData({name, description = 'pizza description', price = 1, imageURL = 'http://image.com/pizza.jpg'}) {
    if (!name) name = generatePizzaName()

    return ({name, description, price, imageURL})
}

const pizzeriasRegistrationData = {
    bancheroRegistrationData: {
        name: 'Banchero',
        telephone: 1112345678,
        email: 'banchero@gmail.com',
        address: 'Av. Corrientes 1300, CABA, Bs. As.',
        password: 'password',
        rol: 'pizzeria'
    },

    guerrinRegistrationData: {
        name: 'Guerrin',
        telephone: 1112345678,
        email: 'guerrin@gmail.com',
        address: 'Av. Corrientes 1368, CABA, Bs.As.',
        password: 'password',
        rol: 'pizzeria'
    }
}

const consumersRegistrationData = {
    kentRegistrationData: {
        name: 'Kent Beck',
        telephone: 1112345678,
        email: 'kent@gmail.com',
        address: 'Av. Corrientes 1300, CABA, Bs. As.',
        password: 'password',
        rol: 'consumer'
    },

    martinRegistrationData: {
        name: 'Martin Fowler',
        telephone: 1112345678,
        email: 'martin@gmail.com',
        address: 'Av. Corrientes 1300, CABA, Bs. As.',
        password: 'password',
        rol: 'consumer'
    }
}

const productsData = {
    mozzarella: {
        name : 'mozzarella',
        description : 'mozzarella description',
        price : 10,
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