class MenuService {

    constructor(usersRepository) {
        this.usersRepository = usersRepository
    }

    async productsInMenuOf(pizzeriaName) {
        const pizzeria = await this.usersRepository.findPizzeriaByName(pizzeriaName)

        return pizzeria.getProductsInMenu()
    }

    async addToMenuOf(pizzeriaName, productToAdd) {
        const pizzeria = await this.usersRepository.findPizzeriaByName(pizzeriaName)

        pizzeria.addToMenu(productToAdd)

        await this.usersRepository.update(pizzeria)
    }
    //addProductToMenu
    /*async createMenu(pizzeriaName, products) {
        const pizzeria = await this.usersRepository.findPizzeriaByName(pizzeriaName)

        pizzeria.registerMenuWith(products)

        await this.usersRepository.update(pizzeria)
    }*/

}

module.exports = { MenuService }