const mongoose = require('mongoose')
const { Schema } = mongoose

const allowedColors = ['white', 'black', 'gray', 'caramel']

const Pets = mongoose.model(
    'Pets',
    new Schema(
        {
            tutor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users'
            },
            name: {
                type: String,
                required: true
            },
            age: {
                type: Number,
                required: true,
                min: 0
            },
            weight: {
                type: Number,
                required: true,
                min: 0
            },
            color: {
                type: String,
                required: true,
                enum: allowedColors
            },
            images: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'PetImage'
                }
            ]
        }
    )
)

module.exports = Pets