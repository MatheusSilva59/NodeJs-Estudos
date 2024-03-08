const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('thoughts', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

try{
    sequelize.authenticate()
    console.log('The connection has been established.')
}catch (err){
    console.log('The connection has been failed due to: ', err)
}

module.exports = sequelize
