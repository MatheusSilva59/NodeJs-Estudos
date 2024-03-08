const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session)

const options = {
    host: 'localhost',
    user:'root',
    password: '',
    database: 'thoughts'
}

const mySqlSession = new MySQLStore(options)

module.exports = mySqlSession