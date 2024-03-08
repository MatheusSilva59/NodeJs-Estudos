const express = require('express')
const router = express.Router()
const path = require('path')

router.use(express.json())

const basePath = path.join(__dirname, '../templates')

router.get('/add', (req, res) => {
    res.sendFile(`${basePath}/userForm.html`)
})

router.post('/save', (req, res) => {
    console.log(req.body)

    const name = req.body.name
    const age = req.body.age

    console.log(`The user name is ${name} and they are ${age} years old.`)

    res.sendFile(`${basePath}/userForm.html`)
})

router.get('/:id', (req, res) => {
    const id = req.params.id

    console.log(`We are looking for the user ${id}.`)

    res.sendFile(`${basePath}/users.html`)
})

module.exports = router