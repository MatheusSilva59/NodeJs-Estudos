const Users = require('../models/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secret = 'EnvVar'

const verifyFields = require('../helpers/verifyFields')

const millisecondToMinute = 1000 * 60
const minutes = 60
const duration = millisecondToMinute * minutes

module.exports = class AuthController {

    static async register(req, res) {
        const { name, phoneNumber, email, password, passwordConfirmation } = req.body

        const verify = verifyFields({ name, phoneNumber, email, password, passwordConfirmation })
        if (!verify.status) {
            res.status(422).json({
                message: `The field ${verify.field} is mandatory.`
            })
            return
        }

        // check email availability
        const userByEmail = await AuthController.checkEmail(email)

        console.log(userByEmail)

        if (userByEmail.length != 0) {
            res.status(422).json({
                message: 'This email is not available.'
            })
            return
        }

        // check password and passwordConfirmation
        if (password != passwordConfirmation) {
            res.status(422).json({
                message: 'The passwords must be matched.'
            })
            return
        }

        // creating user

        const hashedPassword = await AuthController.hashPassword(password)

        try {
            const user = new Users({ name, phoneNumber, email, password: hashedPassword })
            const userSaved = await user.save()
            const token = jwt.sign({ _id: user._id }, secret, { expiresIn: duration })
            AuthController.getCookie(res, token)
            console.log(token)
            res.status(201).json({
                message: 'User has been created successfully!'
            })
        } catch (err) {
            console.log(err)
            res.status(400).json({
                message: err.message
            })
        }

    }

    static async login(req, res) {
        const { email, password } = req.body

        const verify = verifyFields({ email, password })
        if (!verify.status) {
            res.status(422).json({
                message: `The field ${verify.field} is mandatory.`
            })
            return
        }

        try {
            const userByEmail = await Users.findOne({ email }, 'email password').exec()

            // check email
            if (!userByEmail) {
                res.status(401).json({
                    message: 'Invalid email.'
                })
                return
            }

            // check password
            const isPasswordValid = await AuthController.verifyPassword(password, userByEmail.password)

            if (isPasswordValid) {
                try {
                    const token = jwt.sign({ _id: userByEmail._id }, secret, { expiresIn: duration })
                    AuthController.getCookie(res, token)
                    console.log(`The cookie has been created successfully for the user ${userByEmail._id}.`)
                    res.status(200).json({ message: 'User has been authenticated.', userByEmail })
                } catch (err) {
                    console.log(`The cookie creation has failed for the user ${userByEmail._id}. Date: ${new Date().now}`)
                    res.status(200).json({ message: 'The user was authenticated, but the cookie has failed during its creation, which means that the user will have to login again.', userByEmail })
                }

            }
            else {
                res.status(401).json({
                    message: 'Invalid password.'
                })
            }
        } catch (err) {
            res.status(400).json({
                message: err.message
            })
        }
    }

    static async checkAuth(req, res) {
        console.log('Check AUTH: ', req.token)
        if (req.token) {
            res.status(200).json(req.token)
        }
        else {
            res.status(401).json({
                message: 'Not Authenticated.'
            })
        }
    }

    static async getCookie(res, token) {
        return res.cookie('auth_getapet', token, { maxAge: duration, httpOnly: true, path: '/', sameSite: 'Strict', signed: true })
    }

    static async logout(req, res) {
        try {
            res.clearCookie('auth_getapet')
            res.status(200).json({
                message: 'Logout has been concluded.'
            })
        } catch (err) {
            res.status(400).json({
                message: err.message
            })
        }
    }

    static async hashPassword(password) {
        const saltRounds = bcrypt.genSaltSync(10)
        try {
            const hashedPassword = await bcrypt.hash(password, saltRounds)
            return hashedPassword
        } catch (err) {
            console.log('The password hashing has failed due to the following error: ', err)
        }
    }

    static async verifyPassword(plainPassword, hashedPassword) {
        try {
            const isMatch = await bcrypt.compare(plainPassword, hashedPassword)
            return isMatch ? true : false
        } catch (err) {
            console.log('The authentication failed due to the following error: ', err)
        }
    }

    static async checkEmail(email, options = '') {
        const user = await Users.find({ email: email }, options).exec()
        return user
    }
}