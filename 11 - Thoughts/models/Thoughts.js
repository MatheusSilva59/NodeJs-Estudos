const { DataTypes } = require('sequelize')
const db = require('../db/conn')
const Users = require('./Users')
const Thoughts = db.define('Thoughts',{
    message: {
        type: DataTypes.STRING,
        require: true
    }
})

Users.hasMany(Thoughts)
Thoughts.belongsTo(Users)

module.exports = Thoughts