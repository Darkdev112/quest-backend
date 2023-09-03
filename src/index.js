const express = require('express')
const config = require('./config/config')
const logger = require('./config/logger')
const connectDB  = require('./db');
const appLoader = require('./app');
const loadAgenda = require('./api/helpers/agenda');
const { default: mongoose } = require('mongoose');

async function startServer(){
    const app = express();
    await connectDB()
    await appLoader(app)
    
    const agenda = await loadAgenda()
    agenda.start()
    new Promise((resolve) => agenda.once('ready', resolve))
    // const id = new mongoose.Types.ObjectId("64f365a47a3c9185e4f455a4")
    // const job = await agenda.jobs({_id : id })
    // console.log(job);

    const server = app.listen(config.port, () => {
        logger.info(`Server up on port ${config.port}`);
    })
    
    const unexpectedErrorHandler = (error) => {
        logger.error(error)
        if(server){
            server.close(() => {
                logger.info("Server closed")
                process.exit(1)
            })
        }
        else{
            process.exit(1)
        }  
    }
    
    process.on("uncaughtException", unexpectedErrorHandler)
    process.on("unhandledRejection", unexpectedErrorHandler)
}

startServer()
