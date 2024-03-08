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

// app.use(checkAuth)

app.get('/users/:id', (req, res) => {
    const id = req.params.id

    console.log(`We are looking for the user ${id}.`)

    res.sendFile(`${basePath}/users.html`)
})


app.get('/', (req, res) => {
    res.sendFile(`${basePath}/index.html`)
})

app.listen(port, () => {
    console.log(`Application is running on the port ${port}.`)
})