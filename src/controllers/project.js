const {Project, Question} = require('../models')

const makeProject = async (req,res) => {
    try {
        const questions = await Question.find({addiction : req.body.addiction})

        const options = questions.map((question) => {
            return {
                qid : question._id,
            }
        })

        const project = new Project({
            owner : req.user._id ,
            addiction : req.body.addiction,
            options   
        })

        const existing_project = await Project.findOne({owner : req.user._id, addiction : req.body.addiction})
        if(existing_project){
            return res.status(200).send({msg : "You are already on this project"})
        }

        await project.save()
        res.status(201).send({project})
    } catch (error) {
        res.status(400).send({error})     
    }
}


const getProjects = async (req,res) => {
    try {
        const projects = await Project.find({owner : req.user._id})
        res.status(200).send({projects})
    } catch (error) {
        res.status(400).send({error})
    }
}

const getProject = async (req,res) => {
    try {
        const project = await Project.findById(req.params.id)
        await project.populate('sessions options.qid')
        res.status(200).send({project})
    } catch (error) {
        console.log(error);
        res.status(400).send({error})
    }
}

const quitProject = async(req,res) => {
    try {
        const project = await Project.find({owner : req.user._id})
        if(project.length <= 1){
            return res.status(200).send({msg : "Minimum one addiction required"})
        }
        const deleted_project = await Project.findByIdAndRemove(req.params.id)
        res.status(200).send({project : deleted_project})
    } catch (error) {
        res.status(400).send({error})
    }
}

module.exports = {makeProject,getProjects,getProject,quitProject}