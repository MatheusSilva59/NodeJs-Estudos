const { DataTypes } = require('sequelize')
const db = require('../db/conn')
const Thoughts = require('./Thoughts')
const Users = require('./Users')
const ThoughtsAction = db.define('ThoughtsAction', {
    author: {
        type: DataTypes.STRING,
        require: true
    },
    authorId: {
        type: DataTypes.INTEGER,
        require: true
    },
    feedback: {
        type: DataTypes.BOOLEAN,
        require: true
    }
})

Thoughts.hasMany(ThoughtsAction)
ThoughtsAction.belongsTo(Thoughts)

module.exports = ThoughtsAction