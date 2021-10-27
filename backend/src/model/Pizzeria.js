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

    getProductNamed(productName) {
        return this.products.find (product => product.isNamed(productName))
    }

    getProductPriceWithName(productName) {
        const product = this.getProductNamed(productName)
        return product.getPrice()
    }

    removeProductNamed(productName) {
        const index = this.products.findIndex(product => product.isNamed(productName))
        if (index === -1) throw new ModelException(`Product ${productName} not found`)

        this.products.splice(index, 1)
    }

    updateProductNamed(nameOfProductToUpdate, referenceProduct) {
        this.assertCanBeUpdateWith(nameOfProductToUpdate, referenceProduct)

        this.removeProductNamed(nameOfProductToUpdate)
        this.addToMenu(referenceProduct)
    }

    assertHasNoProductNamedAs(productToCheck) {
        if (this.products.some(product => product.getName() === productToCheck.getName()))
            throw new ModelException('A menu cannot have repeated product names')
    }

    assertCanBeUpdateWith(nameOfProductToUpdate, referenceProduct) {
        if (!referenceProduct.isNamed(nameOfProductToUpdate))
            this.assertHasNoProductNamedAs(referenceProduct)
    }
}

module.exports = { Pizzeria }