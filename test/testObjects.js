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
    productsData
}