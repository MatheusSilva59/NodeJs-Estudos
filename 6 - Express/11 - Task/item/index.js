const express = require('express')
const router = express.Router()
const path = require('path')

const basePath = path.join(__dirname, '../templates')

router.get('/add', (req, res) => {
    res.sendFile(`${basePath}/itemAdd.html`)
})

router.post('/save', (req, res) => {
    const name = req.body.name
    const price = req.body.price

    console.log(name, price)

    res.sendFile(`${basePath}/itemAdd.html`)
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    console.log(`The item ID is ${id}`)
    res.sendFile(`${basePath}/index.html`)
})

module.exports = router