const { createProductWith } = require('./helpers/productFactory')

describe('Product', () => {

    it(`it's name gets trimmed`, () => {
        const product = createProductWith({name: '   Name   '})
        expect(product.getName()).toEqual('Name')
    })

    it('cannot have a blank name', () => {
        expect(
            () => createProductWith({name: ''})
        ).toThrow(`A product's name cannot be blank`)
    })

    it('cannot have a negative price', () => {
        expect(
            () => createProductWith({price: -1})
        ).toThrow(`A product's price cannot have a negative amount`)
    })

    it('cannot have an invalid image url', () => {
        expect(
            () => createProductWith({imageURL: 'asdasdasd'})
        ).toThrow('Invalid product image url')
    })

})