const mongoose = require('mongoose')
const { Schema } = mongoose

const allowedStatus = ['Processing', 'Cancelled', 'Completed']

const Adoption = mongoose.model(
    'Adoption',
    new Schema(
        {
            giver_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users'
            },
            receiver_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users'
            },
            pet_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Pets'
            },
            status: {
                type: String,
                default: 'Processing',
                enum: allowedStatus
            }
        }
    )
)

module.exports = Adoption