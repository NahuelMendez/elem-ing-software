class TransientUsersRepository {

    constructor() {
        this.users = []
    }

    async existsPizzeriaNamed(pizzeriaName) {
        return this.users.some(user => user.name === pizzeriaName)
    }

    async findAuthenticatedAs({username, password, ifNotFound}) {
        const foundUser = this.users.find(user => user.isAuthenticatedAs(username, password))
        if (!foundUser) ifNotFound()
        return foundUser
    }

    async save(newUser) {
        this.users.push(newUser)
        return newUser
    }
}

module.exports = { TransientUsersRepository }