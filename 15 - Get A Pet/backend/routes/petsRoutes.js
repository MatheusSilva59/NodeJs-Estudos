const express = require('express')
const router = express.Router()
const PetsController = require('../controllers/PetsController')
const AdoptionController = require('../controllers/AdoptionController')

const auth = require('../helpers/auth')

router.post('/register', auth, PetsController.petRegister)

router.post('/adopt', auth, AdoptionController.createAdoption)
router.patch('/adopt/status', auth, AdoptionController.updateAdoptionStatus)

router.patch('/update', auth, PetsController.updatePetById)

router.delete('/delete/:id', auth, PetsController.deletePetById)

router.get('/mypets', auth, PetsController.getAllPetsByUserId)
router.get('/all', PetsController.getAllPets)

router.get('/adopt/:_id', auth, AdoptionController.getAdoptionData)
router.get('/myadoptions', auth, AdoptionController.getAllAdoptionsByUser)

router.get('/:_id', PetsController.getPetById)

module.exports = router