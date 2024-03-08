const mongoose = require('mongoose')
const { Schema } = mongoose

const UsersImages = mongoose.model(
    'UsersImages',
    new Schema(
        {
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users'
            },
            profileImage: {
                type: String,
                required: true,
            }
        }
    )
)

module.exports = UsersImages