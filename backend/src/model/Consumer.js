const {User} = require("./User")

class Consumer extends User {

    getRoleName() {
        return 'consumer'
    }

    updateData(name, telephone, email, image) {
        this.assertNameIsNotBlank(name)
        this.assertIsValidEmail(email)
        this.assertIsValidImageURL(image)

        this.name = name.trim()
        this.telephone = telephone
        this.email = email
        this.image = image ? image : ''
    }

}

module.exports = { Consumer }