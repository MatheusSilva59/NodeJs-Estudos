const express = require('express')
const app = express()
const port = 3000

const path = require('path')

const basePath = path.join(__dirname, 'templates')

const checkAuth = function(req, res, next){
    req.authStatus = true
    if (req.authStatus){
        console.log('The user is authenticated.')
    }
    else{
        console.log('The user is not authenticated.')
    }
    next()
}

app.use(checkAuth)

app.get('/', (req, res) => {
    res.sendFile(`${basePath}/index.html`)
})

app.listen(port, () => {
    console.log(`Application is running on the port ${port}.`)
})