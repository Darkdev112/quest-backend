const jwt = require('jsonwebtoken')
const {User} = require('../models')

const auth = async (req,res,next) => {
    try {
        const authToken = req.headers.authorization
        if(!authToken || !authToken.startsWith('Bearer ')){
            throw new Error()
        }
        const token = authToken.split(' ')[1]
        const {email}= jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findOne({email, tokens : token})
        if(!user){
            throw new Error()
        }
        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(401).json({error : "Please authenticate"})
    }
}

module.exports = auth