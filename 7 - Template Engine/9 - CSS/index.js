const express = require('express')
const exphbs = require('express-handlebars')

const app = express()
const hbs = exphbs.create({
    partialsDir: ['views/partials']
})


app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/dashboard', (req, res) => {

    const items = ['A', 'B', 'C', 'D', 'E']

    res.render('dashboard', { items })
})

app.get('/blogpost', (req, res) => {
    const post = {
        title: 'Learning Node.js',
        category: 'JavaScript',
        body: 'This article will help you learning Node.js',
        comments: 4
    }

    res.render('blogpost', { post })
})

app.get('/blog', (req, res) => {
    const posts = [
        {
            title: 'Learning Node.js',
            category: 'Learning'
        },
        {
            title: 'Smartphone',
            category: 'Selling'
        }
    ]

    res.render('blog', { posts })
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