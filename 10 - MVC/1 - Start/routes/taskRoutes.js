const express = require('express')
const router = express.Router()
const TaskController = require('../controllers/TaskController')
const Task = require('../models/Task')

router.get('/add', TaskController.createTask)
router.post('/add', TaskController.createTaskSave)

router.get('/edit/:id', TaskController.editTask)
router.post('/update', TaskController.updateTask)

router.post('/toggleTaskStatus', TaskController.toggleTaskStatus)

router.post('/delete', TaskController.deleteTask)
router.get('/', TaskController.showTasks)

module.exports = router 