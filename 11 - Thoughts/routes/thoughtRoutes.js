const express = require('express')
const router = express.Router()
const ThoughtController = require('../controllers/ThoughtsController')
const Thoughts = require('../models/Thoughts')
const ThoughtsAction = require('../models/ThoughtsAction')

const checkAuth = require('../helpers/auth').checkAuth

router.get('/dashboard', checkAuth, ThoughtController.dashboard)
router.get('/add', checkAuth, ThoughtController.createThoughtPage)
router.post('/add', checkAuth, ThoughtController.createThought)

router.get('/edit/:id', checkAuth, ThoughtController.editPage)
router.post('/edit', checkAuth, ThoughtController.updateData)
router.post('/delete', checkAuth, ThoughtController.deleteData)

module.exports = router