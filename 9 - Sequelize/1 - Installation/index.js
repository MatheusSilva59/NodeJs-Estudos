const express = require('express')
const exphbs = require('express-handlebars')
const conn = require('./db/conn')
const User = require('./models/User')
const Address = require('./models/Address')


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

app.get('/', async (req, res) => {

    const users = await User.findAll({ raw: true })

    // console.log(users)

    res.render('home', { users })
})

app.get('/users/create', (req, res) => {
    res.render('adduser')
})


app.get('/users/:id', async (req, res) => {
    const id = req.params.id
    // console.log(id)

    const user = await User.findOne({ include: Address, where: { id: id } })
    // const addresses = await Address.findAll({ raw: true, where: { UserId: id } })
    // console.log(addresses)
    res.render('userview', { user: user.get({ plain: true }), viewMode: true })
})

app.get('/users/:id/edit', async (req, res) => {
    const id = req.params.id
    const user = await User.findOne({ raw: true, where: { id: id } })
    const addresses = await Address.findAll({ raw: true, where: { UserId: id } })
    const viewMode = false
    res.render('userview', { user, addresses, viewMode })
})

app.get('/users/:UserId/address/:id/edit', async (req, res) => {
    const UserId = req.params.UserId
    const id = req.params.id

    const user = await User.findOne({ include: Address, where: { id: UserId } })
    const newUser = user.get({plain: true})
    const mainAddresses = newUser.Addresses

    const editionMode = 'editionMode'
    const addresses = mainAddresses.map(obj => {
        const isEditing = obj.id == id ? true : false
        return { ...obj, [editionMode]: isEditing }
    })
   
    newUser.Addresses = addresses
    
    res.render(`userview`, { user: newUser, viewMode: true})
})

app.post('/users/create', async (req, res) => {

    const name = req.body.name
    const occupation = req.body.occupation
    const newsLetter = req.body.newsLetter === 'on' ? true : false

    await User.create({ name, occupation, newsLetter })

    res.redirect('/')

})

app.post('/address/create', async (req, res) => {
    const UserId = req.body.UserId
    const name = req.body.name
    const street = req.body.street
    const number = req.body.number
    const city = req.body.city
    // console.log(UserId, name, street, number, city)
    // res.redirect('/')
    await Address.create({ UserId, name, street, number, city })
    res.redirect(`/users/${UserId}`)
})

app.post('/users/update', async (req, res) => {
    const id = req.body.id
    const name = req.body.name
    const occupation = req.body.occupation
    const newsLetter = req.body.newsLetter === 'on' ? true : false

    await User.update({ name, occupation, newsLetter }, { where: { id: id } })
    res.redirect(`/users/${id}`)
})

app.post('/address/update', async (req, res) => {
    const UserId = req.body.UserId
    const id = req.body.id
    const name = req.body.name
    const street = req.body.street
    const number = req.body.number
    const city = req.body.city

    const newdata = { id, name, street, number, city }
    await Address.update(newdata, { where: { id: id } })
    res.redirect(`/users/${UserId}`)
})

app.post('/users/delete/:id', async (req, res) => {
    const id = req.params.id
    await User.destroy({ where: { id: id } })
    res.redirect('/')
})

app.post('/users/:UserId/address/delete/:id', async (req, res) => {
    const UserId = req.params.UserId
    const id = req.params.id
    await Address.destroy({ where: { id: id } })
    res.redirect(`/users/${UserId}`)
})

conn.sync().then(() => {
    app.listen(3000, () => {
        console.log('The application has been running on the port 3000.')
    })
}).catch((err) => console.log(err))

// sync({ force: true }) will delete all data from tables
