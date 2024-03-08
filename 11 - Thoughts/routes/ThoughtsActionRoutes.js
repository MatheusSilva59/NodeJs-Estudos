const express = require('express')
const router = express.Router()
const ThoughtsActionController = require('../controllers/ThoughtsActionController')
const ThoughtsAction = require('../models/ThoughtsAction')


router.post('/like', ThoughtsActionController.likeThought)


module.exports = router