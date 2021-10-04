const {User} = require("./User")

class Consumer extends User {

    getRoleName() {
        return 'consumer'
    }

}

module.exports = { Consumer }