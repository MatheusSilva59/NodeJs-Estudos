const Users = require('../models/Users')
const Pets = require('../models/Pets')
const PetImage = require('../models/PetImage')
const Adoption = require('../models/Adoption')
const mongoose = require('mongoose')

module.exports = class PetsController {
    static async migrationPetImage() {
        // const petsWithoutImage = await Pets.updateMany({ images: null }, { image: [0] })
        const teste = await Pets.find({ images: null }).lean()
        console.log('WithoutImages: ', teste)
    }
    static async petRegister(req, res) {
        try {
            const { name, age, weight, color, petUploadImages } = req.body
            const user_id = req.token._id
            const pet = new Pets({ tutor: user_id, name, age, weight, color })
            const petSaved = await pet.save()

            const petImagesIds = await PetsController.setPetImagesId(petUploadImages, pet._id)

            const petUpdate = await Pets.updateOne({ _id: pet._id },
                {
                    $push: {
                        images: {
                            $each: [...petImagesIds]
                        }
                    }
                }
            )


            res.status(201).json({
                message: 'Pet registered successfully!'
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: err.message
            }) // Create a treatment
        }
    }

    static async getAllPets(req, res) {
        PetsController.migrationPetImage()
        try {
            const pets = await Pets.find().populate({ path: 'images', perDocumentLimit: 1 }).lean()
            const petsAdoption = await PetsController.getPetsAndAdoptions(pets)
            res.status(200).json(petsAdoption)
        } catch (err) {
            res.status(500).json({
                message: err.message
            }) // Create a treatment
        }
    }

    static async getAllPetsByUserId(req, res) {
        console.log('Finding pet by tutor id ', req.token._id)
        try {
            const usersPets = await Pets.find({ tutor: req.token._id }).populate('images').lean()
            const usersPetsAdoptions = await PetsController.getPetsAndAdoptions(usersPets)
            res.status(200).json(usersPetsAdoptions)
        } catch (err) {
            res.status(500).json({
                message: err.message
            }) // Create a treatment
        }
    }

    static async getPetById(req, res) {
        try {
            const _id = req.params._id

            // check if object id is valid
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                res.status(404).json({
                    message: 'Pet ID invalid.'
                })
                return
            }

            const pet = await Pets.findById(_id, 'name age weight color images').populate('images').lean()

            // check if pet exists
            if (!pet) {
                res.status(404).json({
                    message: 'Pet was not found.'
                })
                return
            }

            const petAdoption = await PetsController.getPetsAndAdoptions(pet)

            res.status(200).json(petAdoption)
        } catch (err) {
            res.status(500).json({
                message: err.message
            }) // Create a treatment
        }
    }

    static async updatePetById(req, res) {
        try {
            const { _id, name, age, weight, color, petUploadImages, petDeleteImages } = req.body
            console.log(petDeleteImages)

            // check if pet_id is valid
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                res.status(404).json({
                    message: 'Pet ID invalid.'
                })
                return
            }

            const petToBeEdited = await Pets.findById(_id).lean()

            // check if pet exists
            if (!petToBeEdited) {
                res.status(404).json({
                    message: 'Pet was not found.'
                })
                return
            }

            // check if the user owns this pet
            if (petToBeEdited.tutor != req.token._id) {
                res.status(401).json({
                    message: 'You are not authorizez to edit this pet.'
                })
                return
            }

            const petImagesIds = await PetsController.setPetImagesId(petUploadImages, _id)

            await Pets.updateOne({ _id: _id },
                {
                    $set: {
                        name, age, weight, color
                    },
                    $push: {
                        images: {
                            $each: [...petImagesIds]
                        }
                    },
                }
            )

            if (Array.isArray(petDeleteImages)) {
                await Pets.updateOne({ _id: _id },
                    {
                        $pull: {
                            images: { $in: petDeleteImages }
                        }
                    }
                )
                await PetImage.deleteMany({ _id: { $in: petDeleteImages } })
            }

            res.status(201).json({
                message: 'The pet has been edited successfully!'
            })
        } catch (err) {
            res.status(400).json({
                message: err.message
            })
        }
    }

    static async deletePetById(req, res) {
        try {
            const pet_id = req.params.id
            console.log(`PET_ID: ${pet_id} deleted.`)
            const deletePet = await Pets.deleteOne({ _id: pet_id })
            res.status(200).json({
                message: 'The pet has been deleted.'
            })
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    }

    static async setPetImagesId(petUploadImages, _id) {
        const petImagesIds = []
        if (Array.isArray(petUploadImages)) {
            petUploadImages.map(async (img) => {
                const newImage = new PetImage({ pet_id: _id, src: img.src })
                petImagesIds.push(newImage._id)
                await newImage.save()
            })
        }
        return petImagesIds
    }

    static async getPetsAndAdoptions(pets) {
        let data
        if (Array.isArray(pets)) {
            console.log('array')
            data = await Promise.all(
                pets.map(async (pet) => {
                    const adopt = await new Promise((resolve, reject) => {
                        const adopt = Adoption.findOne({ pet_id: pet._id })
                        resolve(adopt)
                    })

                    if (pet.adoptions) {
                        pet.adoptions = [...pet.adoptions, adopt]
                    }
                    else {
                        pet.adoptions = [adopt]
                    }
                    return pet
                })
            )
        }
        else {
            data = await new Promise(async (resolve, reject) => {
                const adopt = await Adoption.findOne({ pet_id: pets._id }).lean()
                if (pets.adoptions) {
                    pets.adoptions = [...pets.adoptions, adopt]
                }
                else {
                    pets.adoptions = [adopt]
                }
                resolve(pets)
            })
        }
        // console.log(data)
        return data
    }
}