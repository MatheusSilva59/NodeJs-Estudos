const Thoughts = require('../models/Thoughts')
const ThoughtsAction = require('../models/ThoughtsAction')
const Users = require('../models/Users')
const { Op } = require('sequelize')
const formattedFlashData = require('../helpers/flashData').formattedFlashData
module.exports = class ThoughtsController {

    static async showAll(req, res) {
        const filter = {
            search: req.query.search ? req.query.search : '',
            order: req.query.order ? req.query.order : 'desc',
            count: 0,
            plural: false
        }

        const thoughts = await Thoughts.findAll(
            {
                attributes: ['message', 'id'],
                include: { model: Users, attributes: ['name'] },
                where: { message: { [Op.like]: `%${filter.search}%` } },
                order: [['createdAt', filter.order]]
            }
        )

        const thoughtsFormatted = thoughts.map(thought => thought.get({ plain: true }))

        filter.count = thoughtsFormatted.length
        filter.plural = filter.count != 1 ? true : false

        const countLike = await ThoughtsAction.count({ where: { feedback: true } })
        console.log(`Likes: ${countLike}`)
        res.render('home', { userId: req.session.userId, thoughtsFormatted, filter })
    }

    static async dashboard(req, res) {
        res.set('Cache-Control', 'no-store');
        try {
            const thoughts = await Thoughts.findAll(
                {
                    attributes: ['message', 'id'],
                    where: { UserId: req.session.userId },
                    order: [['createdAt', 'desc']]
                }
            )
            const throughtsFormatted = thoughts.map(throught => throught.get({ plain: true }))

            res.render('thought/dashboard', { userId: req.session.userId, thoughts: throughtsFormatted })

        } catch (err) {
            console.log('Failed due to: ', err)
            res.redirect('/')
        }
    }

    static createThoughtPage(req, res) {
        res.render('thought/add', { userId: req.session.userId })
    }

    static async createThought(req, res) {
        const message = req.body.message

        const data = {
            UserId: req.session.userId,
            message
        }

        try {
            if (message) {
                await Thoughts.create(data)
                req.flash('message', { level: 'success', message: 'Thought has been created successfully!' })
                res.redirect('/thought/dashboard')
            }
            else {
                req.flash('message', { level: 'error', message: 'The message is not allowed to be empty.' })
                res.redirect('/thought/add')
            }
        } catch (err) {
            req.flash('message', { level: 'error', message: 'Your thought has not been created, please try again soon or get in touch with our support team.' })
            res.redirect('/thought/add')
            console.log(err)
        }


    }

    static async editPage(req, res) {
        res.set('Cache-Control', 'no-store');
        const id = req.params.id
        try {

            const thought = await Thoughts.findOne({ include: { model: Users, attributes: ['id'] }, where: { id: id } })
            const formattedThought = thought.get({ plain: true })

            // formattedThought.createdAt = ThoughtsController.formatDate('en-US', formattedThought.createdAt)
            // formattedThought.updatedAt = ThoughtsController.formatDate('en-US', formattedThought.updatedAt)

            if (formattedThought.UserId === req.session.userId) {

                formattedThought.createdAt = ThoughtsController.formatDate('en-US', formattedThought.createdAt)
                formattedThought.updatedAt = ThoughtsController.formatDate('en-US', formattedThought.updatedAt)

                res.render('thought/edit', { thought: formattedThought, userId: req.session.userId })
            }
            else {
                res.redirect('/')
            }
        } catch (err) {
            console.log('The operation has been failed due to the following error: ', err)
            res.redirect('/')
        }
    }

    static async updateData(req, res) {

        const message = req.body.message
        const id = req.body.id

        try {

            const allowedUser = await Thoughts.findOne({ include: { model: Users, attributes: ['id'] }, where: { id: id } })
            const formmatedAllowedUser = allowedUser.get({ plain: true })

            // console.log(formmatedAllowedUser.UserId, req.session.userId)

            if (formmatedAllowedUser.UserId === req.session.userId) {
                //authenticated
                if (message) {
                    try {
                        await Thoughts.update({ message }, { where: { id: id } })
                        req.flash('message', { level: 'success', message: 'Your thought has been successfully edited!' })
                    } catch (err) {
                        console.log(err)
                        req.flash('message', { level: 'error', message: 'There was an error while editing your thought. Please try again soon.' })
                    }
                    res.redirect('/thought/dashboard')
                }
                else {
                    req.flash('message', { level: 'error', message: 'The message is not allowed to be empty.' })
                    res.redirect(`/thought/edit/${id}`)
                }
            }
            else {
                //not authenticated
                res.redirect('/')
            }

        } catch (err) {
            console.log(err)
            res.redirect('/')
        }
    }

    static async deleteData(req, res) {
        const id = req.body.id
        try {
            await Thoughts.destroy({ where: { id: id, UserId: req.session.id } })
            req.flash('message', { level: 'success', message: 'Your thought has been deleted successfully!' })
        } catch (err) {
            req.flash('message', { level: 'error', message: 'Unfortunately, there was an error while deleting your thought. Please try again soon.' })
            console.log(err)
        }
        res.redirect('/thought/dashboard')
    }

    static formatDate(gmt = 'en-US', date) {
        const oldDate = new Date(date)
        const formattedDate = oldDate.toLocaleDateString(gmt, {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
        return formattedDate
    }
}


