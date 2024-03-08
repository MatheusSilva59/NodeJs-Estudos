const express = require('express')
const session = require('express-session');
const flash = require('express-flash')
const exphbs = require('express-handlebars')

const conn = require('./db/conn')
const mySqlSession = require('./db/connSessions')
const thoughtRoutes = require('./routes/thoughtRoutes')
const router = require('./routes/router')
const throughtsActionRoutes = require('./routes/ThoughtsActionRoutes')

const app = express()


app.use(session({
    name: 'session-thoughts',
    secret: 'a',
    resave: false,
    saveUninitialized: true,
    store: mySqlSession,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 1
    }
}))

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')
app.use(
    express.urlencoded(
        {
            extended: true
        }
    )
)

app.use(express.json())
app.use(express.static('public'))

app.use(flash())

app.use('/actions', throughtsActionRoutes)
app.use('/thought', thoughtRoutes)
app.use('/', router)


conn.sync().then(() => {
    app.listen(3000)
    console.log('The application has been running on the port 3000.')
}).catch((err) => {
    console.log('The connect has been failed due to: ', err)
})