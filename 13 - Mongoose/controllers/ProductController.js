const Product = require('../models/Product')

module.exports = class ProductController {

    static async showProducts(req, res) {
        const products = await Product.find().lean()
        res.render('products/all', { products })
    }

    static async showProduct(req, res) {
        const _id = req.params.id
        const product = await Product.findById(_id).lean()
        // console.log(product)
        // res.redirect('/products')
        res.render('products/product', { product })
    }

    static createProductPage(req, res) {
        res.render('products/createPage')
    }

    static async createProduct(req, res) {
        const name = req.body.name
        const price = req.body.price
        const urlImage = req.body.image
        const description = req.body.description

        const product = new Product({ name, price, urlImage, description })
        await product.save()

        res.redirect('/products')
    }

    static async deleteOneProduct(req, res) {
        const _id = req.body._id
        try {
            await Product.deleteOne({ _id: _id })
        } catch (err) {
            console.log(err)
        }
        res.redirect('/products')
    }

    static async editPage(req, res) {
        const _id = req.params.id
        const product = await Product.findById(_id).lean()
        res.render('products/edit', { product })
    }

    static async editProduct(req, res) {
        const _id = req.body._id
        const name = req.body.name
        const price = req.body.price
        const urlImage = req.body.image
        const description = req.body.description

        const product = { name, price, urlImage, description }

        try {
            await Product.updateOne({ _id: _id }, product)
        } catch (err) {
            console.log(err)
        }

        res.redirect(`/products/${_id}`)
    }

}