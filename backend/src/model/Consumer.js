const {User} = require("./User")

class Consumer extends User {

    getRoleName() {
        return 'consumer'
    }

    updateData(name, telephone, email, address, image) {
        this.assertNameIsNotBlank(name)
        this.assertIsValidEmail(email)
        this.assertIsValidImageURL(image)

        this.name = name.trim()
        this.telephone = telephone
        this.email = email
        this.address = address
        this.image = image ? image : ''
    }

}

module.exports = { Consumer }