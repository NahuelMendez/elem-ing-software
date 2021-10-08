const jwt = require('jsonwebtoken')

const authenticate = role => (request, response, next) => {
    const authHeader = request.get('Authorization')

    if (authHeader) {
        jwt.verify(authHeader,'secret', (error, user) => {
            if (error || role !== user.role) {
                return response.status(403).json({error: 'invalid token or unauthorized user'})
            }
            request.user = user
            next()
        })   
    } else {
        response.status(401).json({error: 'token missing'});
    }
}

module.exports = { authenticatePizzeria: authenticate('pizzeria')}