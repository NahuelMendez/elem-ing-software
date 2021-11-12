const Joi = require('joi')

const userSchema = Joi.object({
    name: Joi.string().required(),
    telephone: Joi.required(),
    email: Joi.string().required(),
    address: Joi.string().required(),
    password: Joi.string().required(),
    rol: Joi.valid('consumer', 'pizzeria').required()
})

const editConsumerDataSchema = Joi.object({
    name: Joi.string().required(),
    telephone: Joi.required(),
    email: Joi.string().required(),
    image: Joi.string()
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

const lineItemsSchema =
    Joi.object({
        productName: Joi.string().required().label('product name in line items'),
        quantity: Joi.number().required().label('quantity in line items')
    })

const orderSchema =
    Joi.object({
        pizzeriaName: Joi.string().required(),
        order: Joi.array().required().items(lineItemsSchema)
    })



module.exports = {userSchema, productSchema, loginSchema, orderSchema, editConsumerDataSchema}
