const {Question} = require('../models')

const enterQuestion = async(req,res) => {
    try {
        const {question, addiction, options} = req.body
        const existing = await Question.findOne({question})
        if(existing){
            return res.status(400).send({error : "existing question"})
        }
        const q = new Question({
            addiction,
            question,
            options
        })
        await q.save()
        res.status(201).send({question : q})
    } catch (error) {
        res.status(400).send({error})
    }
}

const getQuestions = async(req,res) => {
    try {
        const {addiction} = req.body
        const questions = await Question.find({addiction})
        res.status(200).send({questions})
    } catch (error) {
        res.status(400).send({error})
    }
}

module.exports = {enterQuestion,getQuestions}