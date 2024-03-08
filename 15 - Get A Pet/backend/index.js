const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const conn = require('./db/conn')

const authRoutes = require('./routes/authRoutes')
const usersRoutes = require('./routes/usersRoutes')
const petsRoutes = require('./routes/petsRoutes')

const app = express()
const secret = 'EnvVar'

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }))
app.use(cookieParser(secret))

app.use((req, res, next) => {
    const contentLength = req.headers['content-length'] || '0';
    const parsedContentLength = parseInt(contentLength, 10);
    console.log('ContentLength: ', contentLength)
    if (parsedContentLength >= 4 * 1024 * 1024) {
        res.status(413).json({ message: 'Payload too large.' })
    } else {
        next()
    }
})

app.use(express.json({ limit: '4192kb' }))

app.use(express.urlencoded(
    {
        extended: true
    }
))

app.use('/', authRoutes)
app.use('/user', usersRoutes)
app.use('/pets', petsRoutes)


app.get('/', (req, res) => {
    res.json({ message: 'Test' })
})


app.listen(3000)
