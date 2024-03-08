const express = require('express')
const AuthController = require('../controllers/AuthController')
const router = express.Router()

const auth = require('../helpers/auth')

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)

router.get('/checkAuth', auth, AuthController.checkAuth)
router.get('/logout', auth, AuthController.logout)
module.exports = router