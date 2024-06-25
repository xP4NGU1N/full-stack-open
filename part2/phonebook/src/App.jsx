import { useState } from 'react'

const Person = ( {person} ) => <div>{person.name} {person.number} </div>
const Input = ( {title, value, onChange } ) => (
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

  const addContact = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const person = { name: newName, number: newNumber, id: persons.length+1 }
      setPersons(persons.concat(person))
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

  return (
    <div>
      <h2>Phonebook</h2>
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
          return (<Person key={person.id} person={person} />)  
        }
      })}
    </div>
  )
}

export default App