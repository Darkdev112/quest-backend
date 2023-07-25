const mongoose = require('mongoose')

const QandaSchema = new mongoose.Schema({
    session : {
        type : Number,
        required : true,
    },
    theory : [{
        questions : {
            type : String,
            required : true,
        },
        answers : {
            type : String,
        },
        credits : {
            type : Number,
        },
        priority : {
            type : Number
        }
    }],
    owner : {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    }
})

const Qanda = mongoose.model('Qanda', QandaSchema)

module.exports = Qanda