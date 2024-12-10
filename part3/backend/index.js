const express = require('express')
const morgan = require('morgan');
const cors = require('cors')
const app = express()

let phonebook = 
[
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


app.use(cors())



app.use(express.json())


app.get('/api/persons', (request, response) => {
  response.json(phonebook)
})

app.get('/info', (request, response) => {
  const currentDate = new Date()
  const formattedDate = currentDate.toString()

  response.send(`<p>Phonebook has info 
    for ${phonebook.length} people </p> <br/> <p>${formattedDate}</p>`)

})


app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = phonebook.find((p) => p.id === id) 
  
  if (person) {
    response.json(person)
  }
  else {
    response.status(404).send({ error: 'Person not found' });

  }

})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  phonebook = phonebook.filter(person => person.id !== id) 

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if(!body.number || !body.name) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  if (phonebook.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  

  const person = {
    name: body.name,
    number: body.number, 
    id: generateId(),
  };

  phonebook = phonebook.concat(person)
  response.json(person)
}) 

const generateId = () => {
  return Math.floor(Math.random() * 1000).toString();
}




const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`) 
})


