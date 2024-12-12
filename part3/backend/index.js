const express = require('express')
const morgan = require('morgan');
const cors = require('cors')
require('dotenv').config()
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.static('dist'))


app.use(express.json())


//get
app.get('/api/person', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})


//errorHanler
const errorHandler = (error, request, response, next) => {
  console.error(error.message) 
  if (error.name === "CastError") {
    return response.status(400).send({error: "malformatted id"})
  }
  next(error)
}
 
//unknownEndpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}



app.get('/info', (request, response) => {
  const currentDate = new Date()
  const formattedDate = currentDate.toString()

  Person.countDocuments({})
    .then(count => {
      response.send(`<p>Phonebook has info 
        for ${count} people </p> <br/> <p>${formattedDate}</p>`)
    })
  
})



app.get('/api/person/:id', (request, response) => {
  const id = request.params.id
  Person.findById(id)
    .then(person => {
      if(person) {
        response.json(person)
      }
      else {
        response.status(404).send({ error: 'Person not found' });
      }
    })
    .catch(error => next(error));
})



app.delete('/api/person/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id) 
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})



app.post('/api/person', (request, response, next) => {
  const body = request.body;

  if (!body.number || !body.name) {
    return response.status(400).json({ error: 'content missing' });
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
    .then(savedPerson => {
      response.json(savedPerson); 
    })
    .catch(error => next(error)); 
});


app.put('/api/person/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


//Not used anymore
const generateId = () => {
  return Math.floor(Math.random() * 1000).toString();
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`) 
})


