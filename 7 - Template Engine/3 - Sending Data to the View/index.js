const express = require('express')
const exphbs = require('express-handlebars')

const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {

    const user = {
        name: 'Matheus',
        surname: 'Silva'
    }

    res.render('home',{user})
})

app.listen(3000, () => {
    console.log('The Application has been running on the port: 3000.')
})