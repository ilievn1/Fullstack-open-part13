import { useState, useEffect } from 'react'
import weatherAPIService from '../services/weatherAPIService.js'

const WeatherPanel = ({capital}) => {
    const [weather, setWeather] = useState();

    const fetchWeatherHook = () => {
        weatherAPIService
        .getWeather(capital)
        .then(info => {
            setWeather(info.current)
        })
    }
    
    useEffect(fetchWeatherHook, [capital])

    if (!weather) {
        return null
    }

    return(
        <div>
            <p>Temperature: {weather.temp_c} C</p>
            <img src={weather.condition.icon} alt="weather icon" width="100" />
            <p>wind: {weather.wind_kph} k/h</p>
        </div>
    )
}

export default WeatherPanel