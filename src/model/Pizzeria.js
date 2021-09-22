const {ModelException} = require('./ModelException')

class Pizzeria {

    constructor({name, telephone, email, password}) {
        this.assertNameIsNotBlank(name)
        this.assertIsValidPassword(password)

        this.name = name.trim()
        this.telephone = telephone
        this.email = email
        this.password = password
    }

    getName() { return this.name }

    getTelephone() { return this.telephone }

    getEmail() { return this.email }

    assertNameIsNotBlank(name) {
        if (name.trim() === '')
            throw new ModelException("Pizzeria's name cannot be blank")
    }

    assertIsValidPassword(password) {
        if (password.length < 6 || password.includes(' '))
            throw new ModelException('Password must have at least 6 characters and no empty spaces')
    }

}

module.exports = { Pizzeria }