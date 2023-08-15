const mongoose = require('mongoose')

const QandaSchema = new mongoose.Schema({
    session : {
        type : Number,
        required : true,
    },
    theory : [{
        question : {
            type : String,
            required : true,
        },
        answer : {
            type : String,
        },
        credits : {
            type : Number,
        },
        priority : {
            type : Number
        },
        sense : {
            type : String     // basically whether the question is asked in a negative way or a positive way
        }
    }],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    recovery : {
        type : Number,
    }
})

const Qanda = mongoose.model('Qanda', QandaSchema)

module.exports = Qanda