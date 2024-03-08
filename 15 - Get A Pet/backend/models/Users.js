const mongoose = require('mongoose')
const { Schema } = mongoose

const Users = mongoose.model(
    'Users',
    new Schema(
        {
            name: {
                type: String,
                required: true
            },
            phoneNumber: {
                type: Number,
                required: true,
            },
            email: {
                type: String,
                unique: true,
                required: true
            },
            password: {
                type: String,
                required: true
            },
            profileImage_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'UsersImages'
            },
        }
    )
)

module.exports = Users