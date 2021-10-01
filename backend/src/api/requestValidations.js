const {pizzeriaSchema, loginSchema, productsSchema} = require("./schemas")
const {BAD_REQUEST} = require("./statusCode")

const createRequestBodyValidation = bodySchema =>
    (request, response, next) =>
        bodySchema.validateAsync(request.body)
            .then(() => next())
            .catch (error => response.status(BAD_REQUEST).json({error: error.message}))

module.exports = {
    registerPizzeriaRequestValidation: createRequestBodyValidation(pizzeriaSchema),

    loginRequestValidation: createRequestBodyValidation(loginSchema),

    productsRequestValidation: createRequestBodyValidation(productsSchema)
}