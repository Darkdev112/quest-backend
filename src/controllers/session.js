const {Session, Project} = require('../models')
const {ObjectId, default: mongoose} = require('mongoose')

const makeSession = async(req,res) => {
    try{
        const id = new mongoose.Types.ObjectId(req.params.id)
        const sessions = await Session.find({project : id})

        const session = new Session({project : id, session : sessions.length + 1})
        await session.save();
        res.status(201).json({session})
    }
    catch(error){
        res.status(400).json({error})
    }
}
 

const updateSession = async (req,res) => {
    try {
        const {answers} = req.body;
        const id = new mongoose.Types.ObjectId(req.params.id)
        const session = await Session.findOne({project : id, session : req.query.session});
        const project = await Project.findById(req.params.id)
        if(!session){
           return res.status(404).send({error : "Not found"}) 
        }
    
        if(session.answers.length !== 0){
            return res.status(400).send({error : "Duplicate found"})
        }
        
        const answers_mapped = answers.map((answer) => {
            const option_index = project.options.findIndex((option) => {
                return option.qid.toString() === answer.qid
            }) 
            project.options[option_index].pop[answer.option_chosen-1] += 1; 
            return {
                qid : new mongoose.Types.ObjectId(answer.qid),
                option_chosen : answer.option_chosen
            }
        })
        session.answers = [...answers_mapped]

        await session.save();
        await project.save();

        res.status(200).json({project,session})
    } catch (error) {
        res.status(400).json({error})
    }
}

const calculateSession = async(req,res) => {
    try {
        const project = await Project.findById(req.params.id)
        const id = new mongoose.Types.ObjectId(req.params.id)
        const session = await Session.findOne({project : id, session : req.query.session});

        session.answers.forEach((answer) => {
            const option = project.options.find((opt)=>{
                return opt.qid.equals(answer.qid)
            })
            answer.wtp = (option.pop[answer.option_chosen-1]/session.session) * (answer.option_chosen/option.pop.length)
            session.session_score += answer.wtp
        })
        session.session_score /= session.answers.length
        
        await session.save()
        res.status(200).send({session,project})
    } catch (error) {
        console.log(error);
        res.status(400).send({error})
    }
}

const sessionScore = async (req,res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id)
        const session = await Session.findOne({project : id, session : req.query.session});
        res.status(200).send({score : session.session_score})
    } catch (error) {
        res.status(400).send({error})
    }
}

const getSessions = async (req,res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id)
        const sessions = await Session.find({project : id})
        res.status(200).send({sessions})
    } catch (error) {
        res.status(400).send({error})
    }
}

module.exports = {
    makeSession,
    updateSession,
    calculateSession,
    getSessions,
    sessionScore
}