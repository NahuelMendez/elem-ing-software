const {ModelException} = require("./ModelException");

class TransientUsersRepository {

    constructor() {
        this.users = []
    }

    async existsPizzeriaNamed(pizzeriaName) {
        return this.users.some(user => user.getName() === pizzeriaName)
    }

    async existsUserWithEmail(email) {
        return this.users.some(user => user.getEmail() === email)
    }

    async findAuthenticatedAs({username, password, ifNotFound}) {
        const foundUser = this.users.find(user => user.isAuthenticatedAs(username, password))
        if (!foundUser) ifNotFound()
        return foundUser
    }

    async findPizzeriaByName(pizzeriaName) {
        const foundPizzeria = this.users.find(user => user.getName() === pizzeriaName)
        if (!foundPizzeria) throw new ModelException(`Pizzeria ${pizzeriaName} not found`)
        return foundPizzeria
    }

    async save(newUser) {
        this.users.push(newUser)
        return newUser
    }

    async update(user) {

    }
}

module.exports = { TransientUsersRepository }