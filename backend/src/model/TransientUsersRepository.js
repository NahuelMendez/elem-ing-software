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

    async findAuthenticatedAs({email, password, ifNotFound}) {
        const foundUser = this.users.find(user => user.isAuthenticatedAs(email, password))
        if (!foundUser) ifNotFound()
        return foundUser
    }

    async findConsumerByName(consumerName) {
        const foundConsumer = this.users.find(user => user.isNamed(consumerName) && user.isConsumer())
        if (!foundConsumer) throw new ModelException(`Consumer ${consumerName} not found`)
        return foundConsumer
    }

    async findPizzeriaByName(pizzeriaName) {
        const foundPizzeria = this.users.find(user => user.isNamed(pizzeriaName) && user.isPizzeria())
        if (!foundPizzeria) throw new ModelException(`Pizzeria ${pizzeriaName} not found`)
        return foundPizzeria
    }

    async findPizzeriasByPartialName(pizzeriaName) {
        return this.users.filter(user => user.getName().match(new RegExp(pizzeriaName, 'i')) && user.isPizzeria())
    }

    async findPizzeriasByPartialNameSortedByMostCheap(pizzeriaName) {
        return (await this.findPizzeriasByPartialName(pizzeriaName))
            .filter(pizzeria => pizzeria.hasProducts())
            .sort((aPizzeria, anotherPizzeria) =>
                aPizzeria.averageProductPrice() - anotherPizzeria.averageProductPrice()
            )

    }

    async save(newUser) {
        this.users.push(newUser)
        return newUser
    }

    async update(user) {

    }
}

module.exports = { TransientUsersRepository }