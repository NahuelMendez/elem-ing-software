const {User} = require("./User")

class Consumer extends User {

    getRoleName() {
        return 'consumer'
    }

    updateData(name, telephone, email) {
        this.assertNameIsNotBlank(name)
        this.assertIsValidEmail(email)

        this.name = name.trim()
        this.telephone = telephone
        this.email = email
    }

}

module.exports = { Consumer }