const jwt = require('jsonwebtoken')
const {User} = require('../models')
const {CustomError} = require('../helpers')

const auth = async (req,res,next) => {
    try {
        const authToken = req.headers.authorization
        if(!authToken || !authToken.startsWith('Bearer ')){
            throw new CustomError('Unauthorised Error', 401)
        }
        const token = authToken.split(' ')[1]
        const {email}= jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findOne({email, tokens : token})
        if(!user){
            throw new CustomError('Unauthorised Error', 401)
        }
        req.user = user
        req.token = token
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = auth