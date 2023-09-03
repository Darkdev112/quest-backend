const { Project, Question } = require('../models')
const { asyncErrorHandler, CustomError, loadAgenda } = require('../helpers')

const makeProject = asyncErrorHandler(async (req, res) => {
    const existing_project = await Project.findOne({ owner: req.user._id, addiction: req.body.addiction })
    
    if (existing_project) {
        throw new CustomError('Already on this project', 400)
    }

    const questions = await Question.find({ addiction: req.body.addiction })

    const options = questions.map((question) => {
        return {
            qid: question._id,
        }
    })

    
    const project = new Project({
        owner: req.user._id,
        addiction: req.body.addiction,
        options : [...options]
    })

    await project.save()
    res.status(201).send({ project })
})


const getProjects = asyncErrorHandler(async (req, res) => {
    const projects = await Project.find({ owner: req.user._id })
    res.status(200).send({ projects })
})

const getProject = asyncErrorHandler(async (req, res) => {
    const project = await Project.findById(req.params.id)

    if(!project){
        throw new CustomError('Project not found', 404)
    }

    await project.populate('sessions')
    res.status(200).send({ project })
})

const quitProject = asyncErrorHandler(async (req, res) => {
    const agenda = await loadAgenda()

    await new Promise((resolve)=> agenda.once('ready',resolve))

    const projects = await Project.find({ owner: req.user._id })
    
    const project = projects.find((pro) => {
        return pro._id.toString() === req.params.id
    })
    if(!project){
        throw new CustomError('Project not found', 404)
    }

    await agenda.cancel({name : `project_${req.params.id}`})
    await Project.deleteOne({_id : project._id});

    res.status(200).send({ msg : "deleted successfully" })
})

const resumeProject = asyncErrorHandler(async (req,res) => {
    const agenda = await loadAgenda()
    agenda.start()
    const jobs = await agenda.jobs({name : "project_64f34779d61d62c9b678338b"})
    for(const job of jobs){
        console.log(job);
    }
})

module.exports = { makeProject, getProjects, getProject, quitProject, resumeProject }