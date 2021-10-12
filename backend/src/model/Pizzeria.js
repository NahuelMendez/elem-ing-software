const {ModelException} = require('./ModelException')
const {User} = require("./User")

class Pizzeria extends User {

    constructor(props) {
        super(props)
        this.products = []
    }

    getRoleName() {
        return 'pizzeria'
    }

    getProductsInMenu() { return this.products }

    addToMenu(product) {
        this.assertHasNoProductNamedAs(product);

        this.products.push(product)
    }

    removeProductNamed(productName) {
        const index = this.products.findIndex(product => product.isNamed(productName))
        if (index === -1) throw new ModelException(`Product ${productName} not found`)

        this.products.splice(index, 1)
    }

    updateProductNamed(nameOfProductToUpdate, referenceProduct) {
        this.assertHasNoProductNamedAs(referenceProduct)

        this.removeProductNamed(nameOfProductToUpdate)
        this.addToMenu(referenceProduct)
    }

    assertHasNoProductNamedAs(productToCheck) {
        if (this.products.some(product => product.getName() === productToCheck.getName()))
            throw new ModelException('A menu cannot have repeated product names')
    }
}

module.exports = { Pizzeria }