const config = require('./utils/config')
const blogsRouter = require('./controller/blogs')
const userRouter = require('./controller/users')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', userRouter)

module.exports = app