const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        trim : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
    },
    password : {
        type : String,
        required : true,
        trim : true,
        minLength : 6
    },
    tokens : [{
        type : String,
        required : true
    }],
    domain : {
        type : String,
    }
},{
    strict : true,
    versionKey : false,
    timestamps : true
})

UserSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject();
    delete userObject.password
    delete userObject.tokens
    return userObject
}

UserSchema.methods.generateToken = async function(){
    const user = this
    const token = jwt.sign({username : user.username, email : user.email},process.env.JWT_SECRET,{
        expiresIn : 86400
    })

    user.tokens = user.tokens.concat(token)
    await user.save()
    return token
}

UserSchema.statics.findByCredentials = async(email, password) => {
    const oldUser = await User.findOne({email : email})
    if(!oldUser){
        throw new Error('Unable to login!')
    }

    const isValid = await bcrypt.compare(password, oldUser.password)
    if(!isValid){
        throw new Error('Unable to login')
    }

    return oldUser
}

UserSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User