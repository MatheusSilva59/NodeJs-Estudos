const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('MVC', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

try{
    console.log('The connection has been established.')
}catch (err){
    console.log(`The connection failed due to: ${err}`)
}

module.exports = sequelize