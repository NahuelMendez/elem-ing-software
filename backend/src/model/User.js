const {ModelException} = require('./ModelException')
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
const urlRegex = new RegExp(/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i)

class User {

    constructor({name, telephone, email, password}) {
        this.assertNameIsNotBlank(name)
        this.assertIsValidPassword(password)
        this.assertIsValidEmail(email)

        this.name = name.trim()
        this.telephone = telephone
        this.email = email
        this.password = password
        this.image = ''
    }

    isAuthenticatedAs(email, password) {
        return this.email === email && this.password === password
    }

    isNamed(aName) { return this.getName() === aName }

    isPizzeria() { return this.getRoleName() === 'pizzeria' }

    isConsumer() { return this.getRoleName() === 'consumer' }

    hasEmail(email) { return this.getEmail() === email}

    getName() { return this.name }

    getImage() { return this.image }

    getTelephone() { return this.telephone }

    getEmail() { return this.email }

    getRoleName() { throw new Error('Subclass responsibility') }

    assertNameIsNotBlank(name) {
        if (name.trim() === '')
            throw new ModelException("User's name cannot be blank")
    }

    assertIsValidPassword(password) {
        if (password.length < 6 || password.includes(' '))
            throw new ModelException('Password must have at least 6 characters and no empty spaces')
    }

    assertIsValidEmail(email) {
        if (!emailRegex.test(email))
            throw new ModelException('Invalid email')
    }

    assertIsValidImageURL(imageURL) {
        if (!urlRegex.test(imageURL) && imageURL)
            throw new ModelException('Invalid user image url')
    }

}

module.exports = { User }