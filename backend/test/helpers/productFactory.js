const { Product } = require("../../src/model/Product")

module.exports = {
    createProductWith({
         name =`Random product name ${Date.now()}`,
         description = 'Product description',
         price = 1,
         imageURL = 'http://img.com/product.jpg'
    }) {
        return new Product({name, description, price, imageURL})
    },

    createPepperoniPizza() {
        return this.createProductWith({
            name: 'Pepperoni pizza',
            description: `Description for Pepperoni pizza`
        })
    },

    createMeatPizza() {
        return this.createProductWith({
            name: 'Meat pizza',
            description: `Description for Meat pizza`
        })
    }
}