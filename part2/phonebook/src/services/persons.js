import axios from 'axios'

const baseUrl = "http://localhost:3001/persons"

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data)
}

const addPerson = (person)  => {
    return axios.post(baseUrl, person).then(response => response.data)
}

const deleteContact = (id) => {
    return axios.delete(`${baseUrl}/${id}`).then(response => response.data)
}

const updatePerson = (updatedPerson) => {
    return axios.put(`${baseUrl}/${updatedPerson.id}`, updatedPerson).then(response => response.data)
}

export default { getAll, addPerson, deleteContact, updatePerson }