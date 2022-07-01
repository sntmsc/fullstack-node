const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
//app.use(morgan('tiny'))

morgan.token('object', function(req,res){
    return `${JSON.stringify(req.body)}`
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))

app.use(cors())

let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345'
    },
    {
        id: 4,
        name: 'Mary Poppendick',
        number: '39-23-6423122'
    }
]

app.get('/',(request, response)=>{
    response.send('<h1>Hello World!</h1>')
})

app.get('/info',(request, response)=>{
    const today = new Date();
    const dateString = today.toGMTString();
    response.send(`<p>Phonebook has info for ${persons.length} people </p> <br> <p>${dateString}</p>`)
})

app.get('/api/persons', (request, response)=>{
    response.json(persons)
})

app.get('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    persons = persons.filter(person=> person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) =>{
    const person = request.body
    const nameExists = persons.find(per => per.name === person.name)

    if(!person.name){
        response.status(404).json({
            error: 'the name is missing'
        })
    }
    else if(!person.number){
        response.status(404).json({
            error: 'the number is missing'
        })
    }
    else if(nameExists){
        response.status(404).json({
            error: 'name most be unique'
        })
    }
    person.id = Math.floor(Math.random() * 100000000)
    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})