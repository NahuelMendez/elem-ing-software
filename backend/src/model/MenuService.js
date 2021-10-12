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

    async removeProduct(pizzeriaName, nameOfProductToRemove) {
        const pizzeria = await this.usersRepository.findPizzeriaByName(pizzeriaName)

        pizzeria.removeProductNamed(nameOfProductToRemove)

        await this.usersRepository.update(pizzeria)
    }

    async updateProduct({ pizzeriaName, nameOfProductToUpdate, referenceProduct }) {
        const pizzeria = await this.usersRepository.findPizzeriaByName(pizzeriaName)

        pizzeria.updateProductNamed(nameOfProductToUpdate, referenceProduct)

        await this.usersRepository.update(pizzeria)
    }

}

module.exports = { MenuService }