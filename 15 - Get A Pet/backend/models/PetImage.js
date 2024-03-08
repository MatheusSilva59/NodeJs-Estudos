const mongoose = require('mongoose')
const { Schema } = mongoose

const PetImage = mongoose.model(
    'PetImage',
    new Schema(
        {
            pet_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Pet'
            },
            src: {
                type: String,
                required: true,
            }
        }
    )
)

module.exports = PetImage