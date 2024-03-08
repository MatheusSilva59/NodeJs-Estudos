const express = require('express')
const UsersController = require('../controllers/UsersControllers')
const router = express.Router()

const auth = require('../helpers/auth')

router.get('/profile', auth, UsersController.getUserInfo)
router.patch('/edit', auth, UsersController.updateUserInfo)

module.exports = router