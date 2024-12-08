//Phonebook

import { useState, useEffect } from 'react';
import axios from "axios"
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import dataService from "./service/people"
import './index.css'
import Notification from './components/Notification';


const App = () => {
  //Array to hold people & number
  const [persons, setPersons] = useState([
  ]);

  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [failMessage, setFailMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)


  useEffect(() => {
    dataService 
      .getAll()
      .then(response => {
        setPersons(response)
      })
  },[])


  const toggleDelete = (id, name ) => {
    if (window.confirm(`Delete ${name}?`)) {

      dataService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        })
    }
  }


  const handleSubmit = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(n => n.name.toLowerCase() === newName.toLowerCase())

  
    if (existingPerson) {
      if (window.confirm("$(newName) is already added to the phonebook, replace the old number with a new one?") ){
        const updatedPerson = {...existingPerson , number: newNumber}

        
        dataService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person =>
              person.id !== existingPerson.id ? person : returnedPerson
            ))
          })

          .catch(error => {
            setFailMessage(
              `Information of ${newName} has already been removed from the server`
            )
            
  
          })
          setTimeout(() => setFailMessage(null), 5000);
          setPersons(persons.filter(person => person.id !== existingPerson.id));

          setNewName('');
          setNewNumber('');
        
        

      }

    }
    
    else {
      const newPerson = { name: newName, number: newNumber };
  
      dataService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          setSuccessMessage(`${newPerson.name} was added` )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })


        .catch(error => {
          console.error('Error adding new person:', error);
          alert('Failed to add new person');
        });
    }

  
    
  };
  
  


  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message ={successMessage} type="success"  />
      <Notification message={failMessage} type="error" />

      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} toggleDelete={toggleDelete} />

    </div>
  );
};

export default App;
