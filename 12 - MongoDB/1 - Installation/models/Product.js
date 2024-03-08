const conn = require('../db/conn')
const { ObjectId } = require('mongodb')

class Product {

    constructor(name, price, urlImage, description) {
        this.name = name
        this.price = price
        this.urlImage = urlImage
        this.description = description
    }

    save() {

        const product = conn.db().collection('products').insertOne({
            name: this.name,
            price: this.price,
            urlImage: this.urlImage,
            description: this.description
        })


        return product
    }

    static async getAllProducts() {
        const products = await conn.db().collection('products').find().toArray()
        return products
    }

    static async getOneProduct(_id) {
        const product = await conn.db().collection('products').findOne(
            { _id: new ObjectId(_id) },
            (err, doc) => {
                if (err) {
                    console.log(err)
                }
                else {
                    return doc
                }
            }
        )

        return product
    }

    static async deleteOneProduct(_id) {
        try {
            await conn.db().collection('products').deleteOne({ _id: new ObjectId(_id) })
            return { status: 'success' }
        } catch (err) {
            console.log(err)
            return { status: 'fail', err }
        }
    }

    async updateOneProduct(_id) {
        try {
            await conn.db().collection('products').updateOne(
                {
                    _id: new ObjectId(_id)
                },
                {
                    $set: this
                }
            )
            return { status: 'success' }
        } catch (err) {
            console.log(err)
            return { status: 'fail', err }
        }
    }
}

module.exports = Product