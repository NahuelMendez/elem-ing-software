const Joi = require('joi')

const pizzeriaSchema = Joi.object({
    name: Joi.string().required(),
    telephone: Joi.required(),
    email: Joi.string().required(),
    password: Joi.string().required()
})

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
})

const productSchema =
    Joi.object({
        name: Joi.string().required().label('product name'),
        description: Joi.string().label('product description'),
        price: Joi.number().required().label('product price'),
        imageURL: Joi.string().required().label('product imageURL')
    })

module.exports = {pizzeriaSchema, productSchema, loginSchema}
