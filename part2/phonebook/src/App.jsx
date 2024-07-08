import { useState, useEffect } from 'react'
import personService from './services/persons'

const Person = ( {person, handleDelete} ) => {
  return (
  <div>
    {person.name} {person.number}  
    <button onClick={() => handleDelete(person.id)}>delete</button>
  </div>
  )
}

const Notification = ( {message} ) => {
  if (!message) return null

  const colour = message.type === "success" ? 'green' : 'red'
  const notifStyle = {
    color: colour,
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px"
  }

  return (
    <div style={notifStyle}>
      {message.msg}
    </div>
  )
}

const Input = ( {title, value, onChange} ) => (
  <div>
  {title}: <input 
  value={value}
  onChange={onChange} />
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [message, setMessage] = useState(null)

  const addContact = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson && confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      const person = { ...existingPerson, number: newNumber } 
      personService.updatePerson(person)
        .then(updatedPerson => {
          setPersons(persons.map(person => person.id === updatedPerson.id ? updatedPerson : person))
          displayNotification({"type": "success", "msg": `Updated ${updatedPerson.name}`})
          setNewName('')
          setNewNumber('')
        }).catch(error => {
          displayNotification({"type": "failure", "msg": `${error.response.data.error}`})
        })
    } else {
      const person = { name: newName, number: newNumber }
      personService.addPerson(person)
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
          displayNotification({"type": "success", "msg": `Added ${newPerson.name}`})
          setNewName('')
          setNewNumber('')
        }).catch(error => {
          displayNotification({"type": "failure", "msg": `${error.response.data.error}`})
        })
    }
  }

  const handleDelete = (id) => {
    if (confirm(`Delete ${newName}?`)) {
    personService.deleteContact(id)
      .then(deletedPerson => {
        setPersons(persons.filter(person => person.id !== deletedPerson.id))
      })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  const displayNotification = (message) => {
    setMessage(message)
    setTimeout(() => setMessage(null), 2500)
  }

  const loadPersons = () => {
    personService.getAll()
      .then(initialPersons => setPersons(initialPersons))
  }
  useEffect(loadPersons, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Input title="filter shown with" value={newSearch} onChange={handleSearchChange} />

      <h3>Add a new</h3>
      <form onSubmit={addContact}>
        <Input title="name" value={newName} onChange={handleNameChange} />
        <Input title="number" value={newNumber} onChange={handleNumberChange} />
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h3>Numbers</h3>
      {persons.map(person => {
        if (person.name.toLowerCase().includes(newSearch.toLowerCase())) {
          return (<Person key={person.id} person={person} handleDelete={handleDelete} />)  
        }
      })}
    </div>
  )
}

export default App