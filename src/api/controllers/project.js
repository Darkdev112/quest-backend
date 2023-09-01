const { Project, Question } = require('../models')
const { asyncErrorHandler, CustomError } = require('../helpers')


const makeProject = asyncErrorHandler(async (req, res) => {
    const existing_project = await Project.findOne({ owner: req.user._id, addiction: req.body.addiction })
    
    if (existing_project) {
        throw new CustomError('Already on this project', 400)
    }

    const questions = await Question.find({ addiction: req.body.addiction })
    console.log(questions);

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

    await project.populate('sessions options.qid')
    res.status(200).send({ project })
})

const quitProject = asyncErrorHandler(async (req, res) => {
    const project = await Project.find({ owner: req.user._id })
    
    if (project.length <= 1) {
        throw new CustomError('Cannot remove all projects', 400)
    }
    
    const deleted_project = await Project.findByIdAndRemove(req.params.id)

    if(!deleted_project){
        throw new CustomError('Project not found', 404)
    }

    res.status(200).send({ project: deleted_project })
})

module.exports = { makeProject, getProjects, getProject, quitProject }