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

    assertHasNoProductNamedAs(productToCheck) {
        if (this.products.some(product => product.getName() === productToCheck.getName()))
            throw new ModelException('A menu cannot have repeated product names')
    }
}

module.exports = { Pizzeria }