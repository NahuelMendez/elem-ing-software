const {ModelException} = require('./ModelException')
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

class Pizzeria {

    constructor({name, telephone, email, password}) {
        this.assertNameIsNotBlank(name)
        this.assertIsValidPassword(password)
        this.assertIsValidEmail(email)

        this.name = name.trim()
        this.telephone = telephone
        this.email = email
        this.password = password
    }

    isAuthenticatedAs(username, password) {
        return this.name === username && this.password === password
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

    assertIsValidEmail(email) {
        if (!emailRegex.test(email))
            throw new ModelException('Invalid email')
    }
}

module.exports = { Pizzeria }