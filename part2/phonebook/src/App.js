import { useState } from 'react'
import Persons from './components/Persons.js'
import Filter from './components/Filter.js'
import PersonForm from './components/PersonForm.js'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }


  const addPerson = (event) => {
    event.preventDefault()

    if (persons.some(p => p.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      setPersons(persons)
    } else {
        const personObject = {
          name: newName,
          number: newNumber,
        }
        setPersons(persons.concat(personObject))
        setNewName('')
        setNewNumber('')
    }
  }
  
  return (
    <>
      <h2>Phonebook</h2>

      <Filter searchQuery={searchQuery} handleChange={handleSearchChange}/>

      <h2>Add new contact </h2>

      <PersonForm handleSubmit={addPerson}
                  name={newName}
                  number={newNumber}
                  handleNameChange={handleNameChange}
                  handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons searchQuery={searchQuery} persons={persons}/>
    </>
  )
}

export default App