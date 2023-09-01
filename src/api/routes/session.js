const express =require('express')
const {sessionController} = require('../controllers')
const {auth} = require('../middlewares')

const router = express.Router()

router.post('/makesession/:id',auth, sessionController.makeSession)
router.patch('/updatesession/:id',auth, sessionController.updateSession)
router.patch('/calculatesession/:id',auth, sessionController.calculateSession)
router.get('/sessionscore/:id',auth, sessionController.sessionScore)
router.get('/getsessions/:id',auth, sessionController.getSessions)

module.exports = router