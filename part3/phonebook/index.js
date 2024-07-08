require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

morgan.token('body', req => {
    return JSON.stringify(req.body)
})
const postLogger = morgan(':method :url :status :res[content-length] - :response-time ms :body')
const defaultLogger = morgan('tiny')
const logger = (request, response, next) => {
    if (request.method === 'POST') {
        postLogger(request, response, next)
    } else {
        defaultLogger(request, response, next)
    }
}
app.use(logger)

const Person = require('./models/person')

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => response.json(person))
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(person => response.json(person))
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const { name, number } = request.body
    if (!name || !number) {
        response.status(400).json({
            error: 'Name and number are required'
        })
    }
    
    const person = new Person({
        name: name,
        number: number
    })
    person.save()
        .then(result => response.json(result))
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body
    if (!name || !number) {
        response.status(400).json({
            error: 'Name and number are required'
        })
    }

    const person = {
        name: name,
        number: number
    }
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => response.json(updatedPerson))
        .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    Person.find({}).then(persons => {
        response.send(
            `<div>
                Phonebook has info for ${persons.length} people<br></br>
                ${Date(Date.now())}
            </div>`
        )
    }).catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})