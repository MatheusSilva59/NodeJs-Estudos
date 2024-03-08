const express = require('express')
const app = express()

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json())


// rotas ou endpoints

app.get('/', (req, res) => {
    res.status(200).json({ message: 'First route created successfully.' })
})

app.post('/', (req, res) => {
    const { name, age } = req.body

    if(!name){
        res.status(422).json({message: 'The field name is mandatory!'})
        return
    }
    res.status(201).json({message: `Name: ${name}, age: ${age} years old.`})
})

app.listen(3000)