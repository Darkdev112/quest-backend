const express =require('express')
const {qandaController} = require('../controllers')
const {auth} = require('../middlewares')

const router = express.Router()

router.post('/makeQuiz', qandaController.makeQanda)
router.patch('/setQuiz',auth, qandaController.updateQanda)
router.get('/getQuiz',auth, qandaController.getQuestions)
router.patch('/getResult',auth, qandaController.calcResult)

module.exports = router