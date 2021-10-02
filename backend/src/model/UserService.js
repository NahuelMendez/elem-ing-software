const {ModelException} = require('./ModelException')
const {Pizzeria} = require('./Pizzeria')

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

    async login({email, password}) {
        return await this.usersRepository.findAuthenticatedAs({
            email,
            password,
            ifNotFound: () => { throw new ModelException('Invalid email or password') }
        })
    }

    async assertThereIsNoPizzeriaNamed(name) {
        if (await this.existsPizzeriaNamed(name))
            throw new ModelException(`Pizzeria name ${name} already registered`)
    }

    async assertThereIsNotUserWithEmail(email) {
        if (await this.existsUserWithEmail(email))
            throw new ModelException(`A user with email ${email} is already registered`)
    }
}

module.exports = { UserService }