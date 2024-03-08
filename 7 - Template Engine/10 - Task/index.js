const express = require('express')
const exphbs = require('express-handlebars')

const app = express()
const hbs = exphbs.create({
    partialsDir: ['views/partials']
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(express.static('public'))

const products = [
    {
        id: 0,
        name: 'Monitor 24pl',
        price: 1250
    },
    {
        id: 1,
        name: 'Keyboard',
        price: 100
    },
    {
        id: 2,
        name: 'Mouse',
        price: 65
    }
]

app.get('/product/:id', (req, res) => {

    const id = req.params.id
    console.log(products[id])
    res.render('product', { product: products[id]})
})

app.get('/', (req, res) => {
    res.render('home', { products })
})


app.listen(3000, () => {
    console.log('The Application has been running on the port: 3000.')
})