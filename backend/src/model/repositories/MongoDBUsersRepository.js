const { MongooseConnection } = require('./mongoose')
const { Consumer } = require('../Consumer')

const {ModelException} = require("../ModelException");

class MongoDBUsersRepository {

    constructor() {
        this.connection = new MongooseConnection()
    }

    async users() {
        return await this.runInTransaction(async () => {
            return await this.connection.ConsumerModel.find({})
        })
    }

    async existsPizzeriaNamed(pizzeriaName) {
        return (await this.users()).some(user => user.getName() === pizzeriaName)
    }

    async existsUserWithEmail(email) {
        return (await this.users()).some(user => user.getEmail() === email)
    }

    async findAuthenticatedAs({email, password, ifNotFound}) {
        const foundUser = (await this.users()).find(user => user.isAuthenticatedAs(email, password))
        if (!foundUser) ifNotFound()
        return foundUser
    }

    async findConsumerByName(consumerName) {
        const foundConsumer = (await this.users()).find(user => user.isNamed(consumerName) && user.isConsumer())
        if (!foundConsumer) throw new ModelException(`Consumer ${consumerName} not found`)
        return foundConsumer
    }

    async findPizzeriaByName(pizzeriaName) {
        const foundPizzeria = (await this.users()).find(user => user.isNamed(pizzeriaName) && user.isPizzeria())
        if (!foundPizzeria) throw new ModelException(`Pizzeria ${pizzeriaName} not found`)
        return foundPizzeria
    }

    async findPizzeriasByPartialName(pizzeriaName) {
        return (await this.users()).filter(user => user.getName().match(new RegExp(pizzeriaName, 'i')) && user.isPizzeria())
    }

    async save(newUser) {
        return await this.runInTransaction(async () => {
            const createdUser = this.connection.ConsumerModel(newUser)
            return await createdUser.save()
        })
    }

    async update(user) {
        user.save()
    }

    // PRIVATE
    async runInTransaction(asyncFunction) {
        return await this.connection.runInTransaction(asyncFunction)
    }
}

module.exports = { MongoDBUsersRepository }
