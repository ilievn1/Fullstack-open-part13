import { useState } from 'react'
import WeatherPanel from './WeatherPanel.js'

const CountryData = ({country}) => {
    const langArr = Object.values(country.languages)
    const flagLink = Object.values(country.flags)[0]

    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>capital {country.capital[0]}</p>
            <p>area {country.area}</p>
            <h3>languages</h3>
            <ul>
            {langArr.map(lang => (
                <li key={lang}>{lang}</li>
            ))}
            </ul>
            <img src={flagLink} alt="Country flag" width="100" />
            <WeatherPanel capital={country.capital[0]}/>
        </div>
    )
}

const CountryEntry = ({name, handleShow}) => {
    return (
    <li>
        {name.common}
        <button onClick={() => handleShow(name.common)}>Show</button>
    </li>
    )
}

const Results = ({filteredResults}) => {
    const [shownCountry, setShownCountry] = useState(null);

    const handleShow = (n) => {
        // identifies which btn was clicked via country name
        const [countryToBeShown] = filteredResults.filter(c =>
          c.name.common.includes(n)
        );
        
        // toggle visibility
        const isSame = shownCountry && shownCountry.name.common === countryToBeShown.name.common

        if (isSame) {
            setShownCountry(null)     
        } else {
            setShownCountry(countryToBeShown)
        }
         
    };

    if (filteredResults.length === 1) {
        return (<CountryData country={filteredResults[0]}/>)

    } else if (filteredResults.length < 10) {
        return (
            <div>
              <ul>
                {filteredResults.map(c =>
                    <CountryEntry key={c.name.official} name={c.name} handleShow={handleShow}/>
                )} 
              </ul>

              {shownCountry ? (<CountryData country={shownCountry}/>) : null}

            </div>
        )
    } else {
        return (
            <div>
              <p>Too many matches, specify another filter</p>
            </div>
        )
    }
}

export default Results