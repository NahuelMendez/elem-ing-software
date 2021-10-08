const jwt = require('jsonwebtoken')

const authenticate = role => (request, response, next) => {
    const authHeader = request.get('Authorization')

    if (authHeader) {
        jwt.verify(authHeader,'secret', (error, user) => {
            if (error || role !== user.role) {
                return response.sendStatus(403)
            }
            request.user = user
            next()
        })   
    } else {
        response.sendStatus(401);
    }
}

module.exports = { authenticatePizzeria: authenticate('pizzeria')}