const {ModelException} = require('./ModelException')
const {Pizzeria} = require('./Pizzeria')

class UserService {

    constructor(usersRepository) {
        this.usersRepository = usersRepository
    }

    async existsPizzeriaNamed(name) {
        return await this.usersRepository.existsPizzeriaNamed(name)
    }

    async registerPizzeria({name, telephone, email, password}) {
        await this.assertThereIsNoPizzeriaNamed(name)
        
        const newPizzeria = new Pizzeria({name, telephone, email, password})
        return await this.usersRepository.save(newPizzeria)
    }

    async login({username, password}) {
        return await this.usersRepository.findAuthenticatedAs({
            username,
            password,
            ifNotFound: () => { throw new ModelException('Invalid username or password') }
        })
    }

    async assertThereIsNoPizzeriaNamed(name) {
        if (await this.existsPizzeriaNamed(name))
            throw new ModelException(`Pizzeria name ${name} already registered`)
    }

}

module.exports = { UserService }