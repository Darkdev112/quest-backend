const vader = require('vader-sentiment')
const {Qanda} = require('../models')
const { default: calculate } = require('../helpers/algorithm')

const makeQanda = async(req,res) => {
    try{
        const qanda = await Qanda.findOne({owner : req.user._id, session : 0})
        if(qanda){
        return res.status(400).json({error : "error in make user"})
        }
        const {intro,tracking} = require(`../assets/questions-${req.user.domain}.js`)
        const newqanda = new Qanda({session : req.user.sessions, owner : req.user._id});
        if(req.user.sessions == 0){
            newqanda.theory = [...intro]
        }
        else{
            newqanda.theory = [...tracking]
        }
        console.log(newqanda);
        await newqanda.save();
        res.status(201).json({data : newqanda})
    }
    catch(error){
        console.log(error);
        res.status(400).json({error})
    }
}
 

const updateQanda = async (req,res) => {
    try {
        const {question,answer} = req.body;
        const qanda = await Qanda.findOne({owner : req.user._id, session : req.user.session});
        qanda.theory.map((th) => {
            if(th.question.equals(question)){
                const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(answer);
                th.answer = answer
                if(th.sense.equals("positive")){
                    th.credits = intensity.pos;
                }
                else{
                    th.credits = intensity.neg;
                }
            }
        })
        await qanda.save();
        res.status(200).json({data : qanda})
    } catch (error) {
        res.status(400).json({error})
    }
}

const getQuestions = async (req,res) => {
    try {
        const qanda = await Qanda.findOne({owner : req.user._id, session : req.user.session});
        if(qanda.theory.length ===0){
            return res.status(400).json({error : "No questions"})
        }
        const questions = qanda.theory.map((th) => {
            return th.question
        })
        res.status(200).json({data : questions})
    } catch (error) {
        res.status(400).json({error})
    }
}

const calcResult = async(req,res) => {
    try {
        const qanda = await Qanda.find({owner : req.user._id, session : req.user.session});
        const filter = qanda.theory.map((th) => {
            return {
                credits : th.credits,
                priority : th.priority,
                sense : th.sense
            }
        })
        const result = calculate(filter)
        qanda.recovery = result;
        await qanda.save();
        req.user.session =  req.user.session + 1 ;
        await req.user.save();
        res.status.json({data : qanda})
    } catch (error) {
        res.status.json({error})
    }
}

module.exports = {
    makeQanda,
    updateQanda,
    getQuestions,
    calcResult,
    getQuestions
}