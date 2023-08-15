const express =require('express')
const {qandaController} = require('../controllers')
const {auth} = require('../middlewares')

const router = express.Router()

router.post('/makequiz',auth, qandaController.makeQanda)
router.patch('/setquiz',auth, qandaController.updateQanda)
router.get('/getquiz',auth, qandaController.getQuestions)
router.patch('/getresult',auth, qandaController.calcResult)

module.exports = router