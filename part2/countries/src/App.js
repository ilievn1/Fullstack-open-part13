import { useState, useEffect } from 'react'
import Filter from './components/Filter.js'
import Results from './components/Results.js'
import countryService from './services/countryService.js'

const App = () => {
  // State
  const [allCountries, setAllCountries] = useState([])
  const [countryQuery, setCountryQuery] = useState('')

  const filteredResults = allCountries.filter(c => c.name.common.toLowerCase().includes(countryQuery.toLowerCase()))

  // Event handlers

  const handleQueryChange = (event) => {
    setCountryQuery(event.target.value)
  }

  // Effect hooks
  const fetchCountriesHook = () => {
    countryService
      .getAllCountries()
      .then(countriesArr => {
        setAllCountries(countriesArr)
      })
  }

  useEffect(fetchCountriesHook, [])

  return (
    <>
      <Filter searchQuery={countryQuery} handleChange={handleQueryChange}/>
      <Results filteredResults={filteredResults} />
    </>
  )
}

export default App