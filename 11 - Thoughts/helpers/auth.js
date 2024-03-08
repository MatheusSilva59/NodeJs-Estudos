module.exports.checkAuth = function(req, res, next){
    const user = req.session.userId
    if (!user){
        res.redirect('/')
    }

    next()
}