const express = require('express')
const router = express.Router()

const ProductController = require('../controllers/ProductController')

router.get('/create', ProductController.createProductPage)
router.post('/create', ProductController.createProduct)

router.get('/:id', ProductController.showProduct)

router.post('/delete', ProductController.deleteOneProduct)

router.get('/edit/:id', ProductController.editPage)
router.post('/edit', ProductController.editProduct)

router.get('/', ProductController.showProducts)


module.exports = router