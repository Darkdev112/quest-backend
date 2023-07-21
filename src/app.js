const path = require('path')
const dotenv = require('dotenv').config({path : path.join(__dirname, '../config/dev.env')})

const express = require('express')
const cors = require('cors')

require('./db/mongoose')
const app = express();

app.use(express.json())
app.use(cors({
    origin : process.env.CLIENT_URL
}))

app.get('/',async (req,res) => {
    res.status(200).send("Express App")
})

module.exports = app