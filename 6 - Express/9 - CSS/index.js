const express = require('express')
const app = express()
const port = 3000

const path = require('path')

const users = require('./users/index.js')

// reading body
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

// static files

app.use(express.static('public'))

const basePath = path.join(__dirname, 'templates')

app.use('/users', users)

app.get('/', (req, res) => {
    res.sendFile(`${basePath}/index.html`)
})

app.listen(port, () => {
    console.log(`Application is running on the port ${port}.`)
})

