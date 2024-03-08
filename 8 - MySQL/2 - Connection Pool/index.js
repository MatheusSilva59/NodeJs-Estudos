const express = require('express')
const exphbs = require('express-handlebars')
const pool = require('./db/conn')

const app = express()
const hbs = exphbs.create({
    partialsDir: ['views/partials']
})


app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())


app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/books', (req, res) => {

    const query = `SELECT * FROM books;`
    pool.query(query, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        // console.log(data)
        const books = data
        res.render('books', { books })
    })

})

app.get('/books/:id', (req, res) => {
    const id = req.params.id
    const query = `SELECT * FROM books WHERE id = ${id};`
    pool.query(query, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        const book = data[0]
        // console.log(book)
        res.render('book', { book })
    })
})

app.get('/books/:id/edit', (req, res) => {
    const id = req.params.id
    const query = `SELECT * FROM books WHERE id = ${id};`
    pool.query(query, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        const book = data[0]
        res.render('editbook', { book })
    })
})

app.post('/books/update', (req, res) => {
    // console.log('Params: ', req.params)
    const id = req.body.id
    const title = req.body.title
    const pages = req.body.pages

    const query = `UPDATE books SET title = '${title}', pages = '${pages}' WHERE id = ${id};`

    // console.log(query)
    pool.query(query, (err) => {
        if (err) {
            console.log(err)
        }
        res.redirect('/books')
    })
})

app.post('/books/:id/delete', (req, res) => {
    // console.log('Params: ', req.params)
    const id = req.params.id
    const query = `DELETE FROM books WHERE id = ${id};`
    pool.query(query, (err) => {
        if (err) {
            console.log(err)
            return
        }
        res.redirect('/books')
    })
})

app.post('/books/insertbook', (req, res) => {
    const title = req.body.title
    const pages = req.body.pages

    const query = `INSERT INTO books (??,??) VALUES (?, ?);`
    const data = ['title', 'pages', title, pages]

    pool.query(query, data, (err) => {
        if (err) {
            console.log(err)
            return
        }

        res.redirect('/')
    })
})




app.listen(3000, () => {
    console.log('The application has been running on the port 3000.')
})
