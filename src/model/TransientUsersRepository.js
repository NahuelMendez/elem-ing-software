class TransientUsersRepository {

    constructor() {
        this.users = []
    }

    async existsPizzeriaNamed(pizzeriaName) {
        return this.users.some(user => user.name === pizzeriaName)
    }

    async save(newUser) {
        this.users.push(newUser)
        return newUser
    }
}

module.exports = { TransientUsersRepository }