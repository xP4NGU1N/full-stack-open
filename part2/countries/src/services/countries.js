import axios from 'axios'
const api_key = import.meta.env.VITE_SOME_KEY
const countryUrl = "https://studies.cs.helsinki.fi/restcountries/api"


const getAll = () => {
    return axios.get(`${countryUrl}/all`).then(countries => countries.data)
}

const getCountry = (country) => {
    return axios.get(`${countryUrl}/name/${country}`).then(country => country.data)
}

const getWeather = (coordinates) => {
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates[0]}&lon=${coordinates[1]}&units=metric&appid=${api_key}`).then(weather => weather.data)
}

export default { getAll, getCountry, getWeather }