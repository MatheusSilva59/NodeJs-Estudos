const Product = require('../models/Product')

module.exports = class ProductController {

    static async showProducts(req, res) {
        const products = await Product.getAllProducts()
        res.render('products/all', { products })
    }

    static async showProduct(req, res) {
        const _id = req.params.id
        const product = await Product.getOneProduct(_id)
        // console.log(product)
        // res.redirect('/products')
        res.render('products/product', { product })
    }

    static createProductPage(req, res) {
        res.render('products/createPage')
    }

    static createProduct(req, res) {
        const name = req.body.name
        const price = req.body.price
        const urlImage = req.body.image
        const description = req.body.description

        const product = new Product(name, price, urlImage, description)
        product.save()

        res.redirect('/products')
    }

    static async deleteOneProduct(req, res) {
        const _id = req.body._id
        const delProduct = await Product.deleteOneProduct(_id) //returns success or fail according to the deleting status
        res.redirect('/products')
    }

    static async editPage(req, res) {
        const _id = req.params.id
        const product = await Product.getOneProduct(_id)
        res.render('products/edit', { product })
    }

    static async editProduct(req, res) {
        const _id = req.body._id
        const name = req.body.name
        const price = req.body.price
        const urlImage = req.body.image
        const description = req.body.description

        const product = new Product(name, price, urlImage, description)
        product.updateOneProduct(_id)
        
        res.redirect(`/products/${_id}`)
    }

}