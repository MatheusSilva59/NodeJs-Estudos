const Users = require('../models/Users')
const bcrypt = require('bcrypt')
const formattedFlashData = require('../helpers/flashData').formattedFlashData

module.exports = class UsersController {

    static createUserPage(req, res) {
        res.render('users/register')
    }

    static async createUser(req, res) {
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: await UsersController.hashPassowrd(req.body.password),
        }

        const passwords = {
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
        }

        // Users.create(user)
        const emailAvailability = await UsersController.emailAvailability(user.email)
        const isPasswordEqual = passwords.password === passwords.passwordConfirmation ? true : false

        if (emailAvailability) {

            if (isPasswordEqual) {
                try {
                    let level
                    let message

                    try {
                        // await Users.create(user)
                        level = 'success'
                        message = 'Your user has been created successfully!\n'
                    } catch (err) {
                        console.log(err)
                    }

                    try {
                        const userData = await Users.findOne({ raw: true, where: { email: user.email } })
                        // req.session.userId = userData.id
                        req.session.userId = asd
                    } catch (err) {
                        message += 'However, we could not log in to your account automatically due to an issue, please do the login manually.'
                        level = 'warning'
                        console.log(err)
                    }

                    req.flash('message', { level, message })
                    res.redirect('/')

                } catch (err) {
                    req.flash('message', { level: 'error', message: 'Your registration has been failed. Please try again soon or get in touch with our support team.' })
                    res.redirect('register')
                    console.log(err)
                }
            }
            else {
                //not equal password
                req.flash('message', { level: 'error', message: 'The passwords should be equal.' })
                res.redirect('register')
            }

        }
        else {
            //email not available
            req.flash('message', { level: 'error', message: 'This e-mail is not available.' })
            res.redirect('register')
        }
    }

    static async emailAvailability(email) {
        const user = await Users.findOne({ raw: true, where: { email: email } })
        if (user) {
            console.log('Email em uso')
            return false
        }
        else {
            console.log('Email não está em uso')
            return true
        }
    }

    static async hashPassowrd(password) {
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
            console.log(`IsMatch: ${isMatch}`)
            return isMatch ? true : false
        } catch (err) {
            console.log('The authentication failed due to the following error: ', err)
        }
    }

    static loginPage(req, res) {
        res.render('users/login')
    }

    static async login(req, res) {
        const email = req.body.email
        const password = req.body.password
        const emailAvailability = await UsersController.emailAvailability(email)

        if (!emailAvailability) {

            const user = await Users.findOne({ raw: true, where: { email: email } })

            if (await UsersController.verifyPassword(password, user.password)) {
                //Authenticated
                req.session.userId = user.id
                res.redirect('/')
            }
            else {
                //incorrect password
                req.flash('message', { level: 'error', message: 'The password is incorrect.' })
                res.redirect('login')
            }
        }
        else {
            //email not exists
            req.flash('message', { level: 'error', message: 'The e-mail is incorrect.' })
            res.redirect('login')
        }

    }

    static logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.log('The logout has been failed due to: ', err)
                return
            }
            else {
                console.log('The logout has been concluded.')
            }
        })
        res.clearCookie('session-thoughts')
        res.redirect('/login')
    }

}