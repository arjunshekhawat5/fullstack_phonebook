require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./modules/Person')

morgan.token('person', (request, response) => {
    console.log(request.body)
    return JSON.stringify(request.body)
})

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))


let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    const numPersons = persons.length
    let currTime = new Date()
    response.send(
        `<p>
        Phonebook currently has ${numPersons} persons! 
        
        ${currTime}
    </p>`
    )

})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})


app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    console.log(persons)
    response.status(204).end()

})

app.post('/api/persons', (request, response) => {
    const person = request.body

    if (!person.name) {
        console.log('Error : name not present in the post body!');
        const error = {
            error: 'Name must be present!'
        }
        response.status(400).json(error)
    }
    else if (!person.number) {
        console.log('Error: Number not present in the post body!');
        const error = {
            error: 'Number must be present!'
        }
        response.status(400).json(error)
    }
    else if (persons.find(p => p.name === person.name)) {
        console.log('Error: Name must be unique!')
        const error = {
            error: 'This name is already in phonebook, name must be unique!'
        }
        response.status(400).json(error)
    }
    else {
        persons.find(p => { p.name === person.name })
        person.id = generateID()

        persons = persons.concat(person)

        response.json(person)
    }
})


const generateID = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => p.id))
        : 0

    return maxId + 1
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})