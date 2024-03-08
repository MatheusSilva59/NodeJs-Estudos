const Adoption = require('../models/Adoption')
const Pets = require('../models/Pets')

module.exports = class AdoptionController {
    static async createAdoption(req, res) {

        try {
            const receiver_id = req.token._id
            const pet_id = req.body._id //hidden input
            const pet = await Pets.findById(pet_id)
            console.log(pet)
            // check if the receiver_id is the equal to tutor's id or if there is a request with these users already made

            if (receiver_id == pet.tutor) {
                res.status(400).json({
                    message: 'You are not allowed to schedule a visit for a pet registered by you.'
                })
                return
            }

            const findAdoption = await Adoption.find({ giver_id: pet.tutor, receiver_id: receiver_id, pet_id: pet_id })
            if (findAdoption.length != 0) {
                res.status(400).json({
                    message: 'You already have a visit scheduled for this pet.'
                })
                return
            }

            const adoption = new Adoption({ giver_id: pet.tutor, receiver_id, pet_id: pet._id })
            const adoptionSaved = await adoption.save()
            const adoptionInfo = await adoptionSaved.populate('giver_id', 'name phoneNumber')

            res.status(200).json({
                message: `Your visit has been scheduled, please get in touch with ${adoptionInfo.giver_id.name} through the phone number ${adoptionInfo.giver_id.phoneNumber}.`,
                // adoptionSaved
            })

        } catch (err) {
            res.status(500).json({
                message: err.message
            })
            console.log(err)
        }
    }

    static async updateAdoptionStatus(req, res) {
        try {
            const _id = req.body._id
            const adoption = await Adoption.findOne({ _id: _id, giver_id: req.token._id })

            if (!adoption) {
                res.status(401).json({
                    message: 'You are not authorized to update this pet.'
                })
                return
            }

            const status = adoption.status == 'Processing' ? 'Completed' : 'Cancelled'
            const updatedAdoptionStatus = await Adoption.updateOne({ _id }, { status: status })
            // console.log(updatedAdoptionStatus)
            res.status(201).json({
                message: 'The adoption process has been completed.'
            })
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    }

    static async getAllAdoptionsByUser(req, res) {
        try {
            const user_id = req.token._id
            const adoptions = await Adoption.find({ receiver_id: user_id }).populate('giver_id', '_id name phoneNumber').populate('receiver_id', '_id name phoneNumber').populate('pet_id').exec()
            res.status(200).json(adoptions)
        } catch (err) {
            res.status(400).json({
                message: err.message
            })
            console.log(err)
        }
    }

    static async getAdoptionData(req, res) {
        try {
            const _id = req.params._id
            const adoption = await Adoption.find({ _id: _id }).populate('giver_id', '_id name phoneNumber').populate('receiver_id', '_id name phoneNumber').populate('pet_id').exec()
            res.status(200).json(adoption)

        } catch (err) {
            res.status(err.status).json({
                message: err.message
            })
        }
    }
}