const express = require('express')
const app = express()

app.use(express.json())

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

app.get('/api/persons',(request, response) => {
    response.json(persons)
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
    
    if(person) {
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

    if(!person.name){
        console.log('Error : name not present in the post body!');
        const error = {
            error: 'Name must be present!'
        }
        response.status(400).json(error)
    }
    else if(!person.number){
        console.log('Error: Number not present in the post body!');
        const error = {
            error: 'Number must be present!'
        }
        response.status(400).json(error)
    }
    else if(persons.find(p => p.name === person.name)){
        console.log('Error: Name must be unique!')
        const error = {
            error:'This name is already in phonebook, name must be unique!'
        }
        response.status(400).json(error)
    }
    else{
        persons.find(p => {p.name === person.name})
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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})