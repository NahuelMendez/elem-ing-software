const mongoose = require('mongoose')

const { Consumer } = require('../Consumer')
const { Pizzeria } = require('../Pizzeria')
const { Product } = require('../Product')

const consumerSchema = mongoose.Schema({
    name: String,
    telephone: Number,
    email: String,
    password: String
})

consumerSchema.loadClass(Consumer)

const productSchema = mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    imageURL: String
})

productSchema.loadClass(Product)

const pizzeriaSchema = mongoose.Schema({
    name: String,
    telephone: Number,
    email: String,
    password: String,
    products: [ productSchema ]
})

pizzeriaSchema.loadClass(Pizzeria)

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
        this.PizzeriaModel = this.mongooseConnection.model('Pizzeria', pizzeriaSchema)
    }

    async close() {
        await this.mongooseConnection.close()
    }

}

const afterTestCleaning = async () => new MongooseConnection().deleteAll()

module.exports = {
    MongooseConnection,
    afterTestCleaning
}