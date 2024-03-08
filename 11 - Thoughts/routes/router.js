const express = require('express')
const router = express.Router()

const Users = require('../models/Users')
const Thoughts = require('../models/Thoughts')

const AuthController =  require('../controllers/AuthController')
const ThoughtController = require('../controllers/ThoughtsController')


router.get('/', ThoughtController.showAll)


router.get('/register', AuthController.createUserPage)
router.post('/register', AuthController.createUser)

router.get('/login', AuthController.loginPage)
router.post('/login', AuthController.login)

router.post('/logout', AuthController.logout)

module.exports = router