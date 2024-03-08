const secret = 'EnvVar'
const jwt = require('jsonwebtoken')

module.exports = async function auth(req, res, next) {
    const token = req.signedCookies['auth_getapet']
    // console.log(token, new Date())
    if (token) {
        jwt.verify(token, secret, (err, data) => {
            console.log(err)
            console.log(data)
            if (err) {
                res.status(401).json({
                    message: 'Not authorized.'
                })
            }
            else {
                req.token = data
                next()
            }
        })
    }
    else {
        res.status(401).json({
            message: 'Not authorized.'
        })
    }
}