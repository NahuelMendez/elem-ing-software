const {userSchema, loginSchema, productSchema, orderSchema} = require("./schemas")
const {BAD_REQUEST} = require("./statusCode")

const createRequestBodyValidation = bodySchema =>
    (request, response, next) =>
        bodySchema.validateAsync(request.body)
            .then(() => next())
            .catch (error => response.status(BAD_REQUEST).json({error: error.message}))

module.exports = {
    registerPizzeriaRequestValidation: createRequestBodyValidation(userSchema),

    loginRequestValidation: createRequestBodyValidation(loginSchema),

    productRequestValidation: createRequestBodyValidation(productSchema),

    orderRequestValidation: createRequestBodyValidation(orderSchema),
}