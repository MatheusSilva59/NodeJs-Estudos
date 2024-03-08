const express = require('express')
const exphbs = require('express-handlebars')

const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.get('/dashboard', (req, res) => {

    const items = ['A', 'B', 'C', 'D', 'E']

    res.render('dashboard', { items })
})

app.get('/', (req, res) => {

    const user = {
        name: 'Matheus',
        surname: 'Silva'
    }

    const auth = true

    const approved = true

    res.render('home', { user, auth, approved })
})

app.listen(3000, () => {
    console.log('The Application has been running on the port: 3000.')
})