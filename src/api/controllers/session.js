const { ObjectId, default: mongoose } = require('mongoose')
const { Session, Project } = require('../models')
const { asyncErrorHandler } = require('../helpers')
const {CustomError} = require('../helpers')

const makeSession = asyncErrorHandler(async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id)
    const sessions = await Session.find({ project: id })

    const session = new Session({ project: id, session: sessions.length + 1 })
    await session.save();
    res.status(201).json({ session })
})


const updateSession = asyncErrorHandler(async (req, res) => {
    const { answers } = req.body;
    const id = new mongoose.Types.ObjectId(req.params.id)
    const session = await Session.findOne({ project: id, session: req.query.session });
    const project = await Project.findById(req.params.id)
    if (!session) {
        throw new CustomError('Session not found',404)
    }

    if (session.answers.length !== 0) {
        throw new CustomError('Duplicate Found',400)
    }

    const answers_mapped = answers.map((answer) => {
        const option_index = project.options.findIndex((option) => {
            return option.qid.toString() === answer.qid
        })
        project.options[option_index].pop[answer.option_chosen - 1] += 1;
        return {
            qid: new mongoose.Types.ObjectId(answer.qid),
            option_chosen: answer.option_chosen
        }
    })
    session.answers = [...answers_mapped]

    await session.save();
    await project.save();
    res.status(200).json({ project, session })
})

const calculateSession = asyncErrorHandler(async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id)
    const project = await Project.findById(req.params.id)
    const session = await Session.findOne({ project: id, session: req.query.session });

    if (!session) {
        throw new CustomError('Session not found',404)
    }

    session.answers.forEach((answer) => {
        const option = project.options.find((opt) => {
            return opt.qid.equals(answer.qid)
        })
        answer.wtp = (option.pop[answer.option_chosen - 1] / session.session) * (answer.option_chosen / option.pop.length)
        session.session_score += answer.wtp
    })
    session.session_score /= session.answers.length

    await session.save()
    res.status(200).send({ session, project })
})

const sessionScore = asyncErrorHandler(async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id)
    const session = await Session.findOne({ project: id, session: req.query.session });
    res.status(200).send({ score: session.session_score })
})

const getSessions = asyncErrorHandler(async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id)
    const sessions = await Session.find({ project: id })
    res.status(200).send({ sessions })
})

module.exports = {
    makeSession,
    updateSession,
    calculateSession,
    getSessions,
    sessionScore
}