const {User} = require('../models')

const signup = async(req,res) => {
    try {
        const {username, email, password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({error : "Invalid credentials"})
        }

        const user = new User({username, email, password})
        await user.save()

        const token = await user.generateToken()
        res.status(201).json({user,token})
    } catch (error) {
        res.status(400).json({error})
    }
}


const login = async(req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateToken()
        res.status(200).json({user,token})
    } catch (error) {
        res.status(400).json({error})
    }
}

const getUser = async(req,res) => {
    try {
        res.status(200).json({user : req.user})
    } catch (error) {
        res.status(400).json({error})
    }
}

const logout = async(req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token !== req.token
        })
        await req.user.save()
        res.status(200).json({msg : "logged out"})
    } catch (error) {
        res.status(400).json({error})
    }
}

const logoutAll = async(req,res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).json({msg : "logged out everywhere"})
    }
    catch(error){
        res.status(400).json({error})
    }
}

module.exports = {
    login,
    signup,
    getUser,
    logout,
    logoutAll
}