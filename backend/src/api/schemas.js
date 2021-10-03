const Joi = require('joi')

const userSchema = Joi.object({
    name: Joi.string().required(),
    telephone: Joi.required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    rol: Joi.string().required()
})

const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
})

const productSchema =
    Joi.object({
        name: Joi.string().required().label('product name'),
        description: Joi.string().label('product description'),
        price: Joi.number().required().label('product price'),
        imageURL: Joi.string().required().label('product imageURL')
    })

module.exports = {userSchema, productSchema, loginSchema}
