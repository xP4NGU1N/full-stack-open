import { useState, useEffect } from 'react'
import countryService from './services/countries'

const Country = ( {country, handleShow} ) => {
  return (
  <div>
    {country} <span>  </span>
    <button onClick={() => handleShow(country)}>show</button>
  </div>
  )
}

const Countries = ( {countries, handleShow} ) => {
  if (!countries) return null
  return (
    countries.map(country => 
    <Country key={country} country={country} handleShow={handleShow} />
    )
  )
}
  

const CountryDetails = ( {country} ) => {
  return (
  <div>
    <h2>{country.name.common}</h2>
    <div>
      capital {country.capital[0]} <br></br>
      area {country.area}
    </div>
    <h3>languages:</h3>
    <ul>
      {Object.values(country.languages).map((language, index) => (
        <li key={index}>{language}</li>
      ))}
    </ul>
    <img src={country.flags.png} alt={country.flags.alt} ></img>
  </div>
  )
}

const WeatherDetails = ( {weather} ) => {
  return (
    <div>
      <h2>Weather in {weather.name}</h2>
      <div>temperature {weather.main.temp} Celcius</div>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description}></img>
      <div>wind {weather.wind.speed}m/s</div>
    </div>
  )
}

const OneCountry = ( {country} ) => {
  if (!country) return null
  return (
  <div>
    <CountryDetails country={country.countryDetail} />
    <WeatherDetails weather={country.weatherDetail} />
  </div>
  )
}

const Error = ( {message} ) => {
  if (!message) return null
  return (
    <div>
      {message}
    </div>
  )
}

const Input = ( {title, value, onChange } ) => (
  <div>
  {title}: <input 
  value={value}
  onChange={onChange} />
  </div>
)

const App = () => {
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState(null)
  const [newSearch, setNewSearch] = useState('')
  const [message, setMessage] = useState('')
  const [oneCountry, setOneCountry] = useState(null)

  const renderOneCountry = (country) => {
    countryService.getCountry(country).then(
      countryDetail => {
        countryService.getWeather(countryDetail.latlng).then(
            weatherDetail => setOneCountry({countryDetail, weatherDetail})
          )
      }
    )
  }

  const handleSearchChange = (event) => {
    const searchValue = event.target.value
    setNewSearch(searchValue)
    const filter = countries.filter(country => country.toLowerCase().includes(searchValue.toLowerCase()))
    if (filter.length > 10) {
      setMessage("Too many matches, specify another filter")
      setFilteredCountries(null)
      setOneCountry(null)
    } else if (filter.length === 0) {
      setMessage("No matches, specify another filter")
      setFilteredCountries(null)
      setOneCountry(null)
    } else if (filter.length === 1) {
      setMessage(null)
      setFilteredCountries(null)
      renderOneCountry(filter[0])
    } else {
      setMessage(null)
      setOneCountry(null)
      setFilteredCountries(filter)
    }
  }

  const handleShow = (country) => {
    setMessage(null)
    setFilteredCountries(null)
    renderOneCountry(country)
  }

  const loadCountries = () => {
    countryService.getAll()
      .then(allCountries => setCountries(allCountries.map(country => country.name.common).sort()))
    }
  useEffect(loadCountries, [])

  return (
    <div>
      <Input title="find countries" value={newSearch} onChange={handleSearchChange} />
      <br></br>
      <Error message={message} />
      <OneCountry country={oneCountry} />
      
      <Countries countries={filteredCountries} handleShow={handleShow} />
    </div>
  )
}

export default App