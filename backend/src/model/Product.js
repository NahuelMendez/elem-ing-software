const {ModelException} = require("./ModelException");
const urlRegex = new RegExp(/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i)


class Product {

    constructor({name, description, price, imageURL}) {
        this.assertNameIsNotBlank(name)
        this.assertPriceAmountIsNotNegative(price)
        this.assertIsValidImageURL(imageURL)

        this.name = name.trim()
        this.description = description
        this.price = price
        this.imageURL = imageURL
    }

    equals(aProduct) {
        return this.name === aProduct.getName() &&
               this.description === aProduct.getDescription() &&
               this.price === aProduct.getPrice() &&
               this.imageURL === aProduct.getImageURL()
    }

    isNamed(productName) {
        return this.name === productName.trim()
    }

    getName() { return this.name }
    getDescription() { return this.description }
    getPrice() { return this.price }
    getImageURL() { return this.imageURL }

    assertNameIsNotBlank(name) {
        if (name.trim() === '')
            throw new ModelException(`A product's name cannot be blank`)
    }

    assertPriceAmountIsNotNegative(price) {
        if (price < 0) throw new ModelException(`A product's price cannot have a negative amount`)
    }

    assertIsValidImageURL(imageURL) {
        if (!urlRegex.test(imageURL))
            throw new ModelException('Invalid product image url')
    }

}

module.exports = { Product }