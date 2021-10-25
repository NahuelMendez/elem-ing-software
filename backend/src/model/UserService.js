const {ModelException} = require('./ModelException')
const {Pizzeria} = require('./Pizzeria')
const {Consumer} = require("./Consumer");

class UserService {

    constructor(usersRepository) {
        this.usersRepository = usersRepository
    }

    async existsPizzeriaNamed(name) {
        return await this.usersRepository.existsPizzeriaNamed(name)
    }

    async existsUserWithEmail(email) {
        return await this.usersRepository.existsUserWithEmail(email)
    }

    async registerPizzeria({name, telephone, email, password}) {
        await this.assertThereIsNoPizzeriaNamed(name)
        await this.assertThereIsNotUserWithEmail(email)

        const newPizzeria = new Pizzeria({name, telephone, email, password})
        return await this.usersRepository.save(newPizzeria)
    }

    async registerConsumer({name, telephone, email, password}) {
        await this.assertThereIsNoConsumerNamed(name)
        await this.assertThereIsNotUserWithEmail(email)

        const newConsumer = new Consumer({name, telephone, email, password})
        return await this.usersRepository.save(newConsumer)
    }

    async login({email, password}) {
        return await this.usersRepository.findAuthenticatedAs({
            email,
            password,
            ifNotFound: () => { throw new ModelException('Invalid email or password') }
        })
    }

    async findConsumerByName(name) {
        return await this.usersRepository.findConsumerByName(name)
    }

    async findPizzeriaByName(name) {
        return await this.usersRepository.findPizzeriaByName(name)
    }

    async findPizzeriasByPartialName(name) {
        return await this.usersRepository.findPizzeriasByPartialName(name)
    }

    async assertThereIsNoPizzeriaNamed(name) {
        if (await this.existsPizzeriaNamed(name))
            throw new ModelException(`Pizzeria name ${name} already registered`)
    }

    async assertThereIsNoConsumerNamed(name) {
        if (await this.existsPizzeriaNamed(name))
            throw new ModelException(`Consumer name ${name} already registered`)
    }

    async assertThereIsNotUserWithEmail(email) {
        if (await this.existsUserWithEmail(email))
            throw new ModelException(`A user with email ${email} is already registered`)
    }
}

module.exports = { UserService }