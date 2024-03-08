const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('nodesequelize', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

// try {
//     sequelize.authenticate()
//     console.log('The connection has been established.')
// } catch(err) {
//     console.log('The connection failed with the following error: ' + err)
// }


module.exports = sequelize