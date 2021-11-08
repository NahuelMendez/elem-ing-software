require('../javascript-collections-extensions')

const {ModelException} = require('./ModelException')
const {User} = require("./User")

class Pizzeria extends User {

    constructor(props) {
        super(props)
        this.products = []
    }

    hasProducts() {
        return this.products.length !== 0
    }

    getRoleName() {
        return 'pizzeria'
    }

    averageProductPrice() {
        return this.products.sum(product => product.getPrice()) / this.products.length
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
        return this.getProductNamed(productName).getPrice()
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