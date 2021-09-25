class MenuService {

    constructor(usersRepository) {
        this.usersRepository = usersRepository
    }

    async productsInMenuOf(pizzeriaName) {
        const pizzeria = await this.usersRepository.findPizzeriaByName(pizzeriaName)

        return pizzeria.getProductsInMenu()
    }

    async createMenu(pizzeriaName, products) {
        const pizzeria = await this.usersRepository.findPizzeriaByName(pizzeriaName)

        pizzeria.registerMenuWith(products)

        await this.usersRepository.update(pizzeria)
    }

}

module.exports = { MenuService }