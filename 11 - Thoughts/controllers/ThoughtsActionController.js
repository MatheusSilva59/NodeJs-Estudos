const ThoughtsAction = require('../models/ThoughtsAction')
const Thoughts = require('../models/Thoughts')
const Users = require('../models/Users')

module.exports = class ThoughtsActionController {
    static async likeThought(req, res) {
        const UserId = req.session.userId
        const thoughtId = req.body.thoughtId

        const userInfo = await Users.findOne({ where: { id: UserId }, raw: true })

        try {
            ThoughtsAction.create({ author: userInfo.name, authorId: userInfo.id, feedback: true, ThoughtId: thoughtId })
        } catch (err) {
            console.log(err)
        }

        console.log(userInfo)
        res.redirect('/')
    }
}