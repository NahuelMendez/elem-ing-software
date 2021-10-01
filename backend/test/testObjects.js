let counter = 0
const nextCounter = () => counter++
const generatePizzeriaName = () => `P${nextCounter()}`

function createPizzeriaRegistrationData({name, telephone = 1112345678, email, password = 'pass123', confirmPassword}) {
    if (!name) name = generatePizzeriaName()
    if (!email) email = `${name}@d.c`
    if (!confirmPassword) confirmPassword = password

    return ({ name, telephone, email, password, confirmPassword })
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
    pizzeriasRegistrationData,
    productsData,
    createPizzeriaRegistrationData
}