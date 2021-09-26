const Joi = require('joi')

const pizzeriaSchema = Joi.object({
    name: Joi.string().required(),
    telephone: Joi.required(),
    email: Joi.string().required(),
    password: Joi.string().required()
})

const productsSchema = Joi.array().items(
    Joi.object({
        name: Joi.string(),
        description : Joi.string(),
        price : Joi.number(),
        imageURL : Joi.string()
    })
)

module.exports = {pizzeriaSchema, productsSchema}