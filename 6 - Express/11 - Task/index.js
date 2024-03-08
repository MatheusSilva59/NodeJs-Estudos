const express = require('express')
const app = express()
const port = 5000
const path = require('path')
const item = require('./item/index.js')

const basePath = path.join(__dirname, 'templates')

// reading body

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

//

app.use(express.static('public'))

app.use('/item', item)

app.get('/', (req, res) => {
    res.sendFile(`${basePath}/index.html`)
})

app.listen(port, () => {
    console.log(`The application is running on the port ${port}.`)
})

app.use(function(req, res, next){
    res.sendFile(`${basePath}/404.html`)
})