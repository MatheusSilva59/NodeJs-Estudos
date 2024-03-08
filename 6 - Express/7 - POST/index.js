const express = require('express')
const app = express()
const port = 3000

const path = require('path')

// reading body
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

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

app.get('/users/add', (req, res) => {
    res.sendFile(`${basePath}/userForm.html`)
})

app.post('/users/save', (req, res) => {
    console.log(req.body)

    const name = req.body.name
    const age = req.body.age

    console.log(`The user name is ${name} and they are ${age} years old.`)

    res.sendFile(`${basePath}/userForm.html`)
})

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

