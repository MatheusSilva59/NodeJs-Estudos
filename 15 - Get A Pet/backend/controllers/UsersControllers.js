const Users = require('../models/Users')
const UsersImages = require('../models/UsersImages')
const AuthController = require('./AuthController')

const verifyFields = require('../helpers/verifyFields')

module.exports = class UsersController {
    static async getUserInfo(req, res) {
        try {
            const userInfo = await Users.findOne({ _id: req.token._id }, '_id name phoneNumber email').populate('profileImage_id', 'profileImage').exec()
            res.status(200).json(userInfo)
        } catch (err) {
            res.status(500).json({
                message: 'An error occurred during this request.'
            })
            console.log(err)
        }
    }

    static async updateUserInfo(req, res) {
        try {
            const { email, name, phoneNumber, password, passwordConfirmation } = req.body
            // check password and confirmation and email avaibility

            const potentialNewEmail = await Users.find({ email: email })
            const currentEmail = await Users.findById(req.token._id)

            // check mandatory fields
            const verify = verifyFields({ email, name, phoneNumber })
            if (!verify.status) {
                res.status(422).json({
                    message: `The field ${verify.field} must be filled.`
                })
                return
            }

            // check email avaibility
            if (potentialNewEmail.length != 0 && currentEmail.email !== email) {
                res.status(400).json({
                    message: 'This email is already being used.'
                })
                return
            }

            // check password 
            const isPasswordValid = password === passwordConfirmation ? true : false

            if (!isPasswordValid) {
                res.status(400).json({
                    message: 'The passwords must be equal.'
                })
                return
            }

            let userProfileImage
            if (req.body?.profileImage) {

                const deleteOldImage = await UsersImages.deleteOne({ user_id: req.token._id })

                userProfileImage = new UsersImages({ user_id: req.token._id, profileImage: req.body.profileImage })
                await userProfileImage.save()
            }

            if (isPasswordValid && password != '' && password != null) {
                const hashedPassword = await AuthController.hashPassword(password)
                await Users.updateOne({ _id: req.token._id }, { email, name, phoneNumber, password: hashedPassword })
            }
            else if (userProfileImage) {
                await Users.updateOne({ _id: req.token._id }, { email, name, phoneNumber, profileImage_id: userProfileImage._id })
            }
            else {
                await Users.updateOne({ _id: req.token._id }, { email, name, phoneNumber })
            }

            res.status(201).json({
                message: 'User has been edited successfully!'
            })
        } catch (err) {
            res.status(500).json({
                message: 'An error occurred during this request.'
            })
            console.log(err)
        }
    }
}