const mongoose = require('mongoose')

const { Consumer } = require('../Consumer')

const consumerSchema = mongoose.Schema({
    name: String,
    telephone: Number,
    email: String,
    password: String
})

consumerSchema.loadClass(Consumer)

class MongooseConnection {

    async runInTransaction(asyncFunction) {
        await this.start()
        const result = await asyncFunction()
        await this.close()
        return result
    }

    async deleteAll() {
        await this.runInTransaction(async () =>
            this.mongooseConnection.dropDatabase()
        )
    }

    async start() {
        this.mongooseConnection = await mongoose.createConnection('mongodb://localhost:27017/test')

        this.ConsumerModel = this.mongooseConnection.model('Consumer', consumerSchema)
    }

    async close() {
        await this.mongooseConnection.close()
    }

}

const afterTestCleaning = async () => new MongooseConnection().deleteAll()

module.exports = {
    MongooseConnection,
    afterTestCleaning,
    consumerSchema
}
