const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
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

let persons = [
    { 
        "id": "1",
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": "2",
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": "3",
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": "4",
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        persons = persons.filter(person => person.id !== id)
        response.json(person).status(204).end()
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const { name, number } = request.body
    if (!name || !number) {
        response.status(400).json({
            error: 'Name and number are required'
        })
    } else if (persons.find(person => person.name === name)) {
        response.status(400).json({
            error: 'name must be unique'
        })
    }
    
    const person = {
        id: Math.floor(Math.random()*1000).toString(),
        name: request.body.name,
        number: request.body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

app.get('/info', (request, response) => {
    response.send(
        `<div>
            Phonebook has info for ${persons.length} people<br></br>
            ${Date(Date.now())}
        </div>`
    )
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})