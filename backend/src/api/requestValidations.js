const {pizzeriaSchema, loginSchema, productSchema} = require("./schemas")

const createRequestBodyValidation = bodySchema =>
    (request, response, next) =>
        bodySchema.validateAsync(request.body)
            .then(() => next())
            .catch (error => response.status(400).json({error: error.message}))

module.exports = {
    registerPizzeriaRequestValidation: createRequestBodyValidation(pizzeriaSchema),

    loginRequestValidation: createRequestBodyValidation(loginSchema),

    productRequestValidation: createRequestBodyValidation(productSchema)
}