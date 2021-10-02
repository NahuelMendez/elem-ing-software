const generatePizzeriaName = () => `P${Date.now()}`

function createPizzeriaRegistrationData({name, telephone = 1112345678, email, password = 'pass123', confirmPassword}) {
    if (!name) name = generatePizzeriaName()
    if (!email) email = `${name}@d.c`
    if (!confirmPassword) confirmPassword = password

    return ({ name, telephone, email, password, confirmPassword })
}

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
        password: 'password'
    },

    guerrinRegistrationData: {
        name: 'Guerrin',
        telephone: 1112345678,
        email: 'guerrin@gmail.com',
        password: 'password'
    }
}

const consumersRegistrationData = {
    kentRegistrationData: {
        name: 'Kent Beck',
        telephone: 1112345678,
        email: 'kent@gmail.com',
        password: 'password'
    },

    martinRegistrationData: {
        name: 'Martin Fowler',
        telephone: 1112345678,
        email: 'martin@gmail.com',
        password: 'password'
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
    createPizzaData,
    pizzeriasRegistrationData,
    consumersRegistrationData,
    productsData
}