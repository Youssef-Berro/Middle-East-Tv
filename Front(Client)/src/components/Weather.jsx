import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './../css/Weather.css'
import {toast} from 'react-toastify'


function Weather() {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const [weatherData, setWeatherData] = useState({});
    const [cityInput, setCityInput] = useState(false);
    const [city, setCity] = useState('Beirut');

    const fetchWeather = async () => {
        try {
            const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=7&appid=07f2a451090c5d804494d164f12a4024`;
            const resp = await axios.get(url);
            const data = await resp.data;
            const weekWeather = data.list.map( day => {
                return ({
                    temp: day.main.temp,
                    title: day.weather[0].main,
                    description: day.weather[0].description
                })
            })

            setWeatherData({
                nextWeekWeather: [...weekWeather],
                city: data.city.name,
                country: data.city.country
            })
        }catch(err) {
            toast.info("city or country doesn't exists");
            setCity('Beirut');
        }
    }


    const changeCityWeather = async () => {
        await fetchWeather();
        setCityInput(false);
    }


    useEffect(() => { fetchWeather() }, [])

    return (
        <>
            {Object.keys(weatherData).length !== 0 && 
                <div className="weather-container">
                    <div className="weather-head">
                        {!cityInput ? (
                            <>
                                <div className="weather-title">Weather</div>
                                <div className="weather-head-right-section">
                                    <div className="country-and-city">
                                        {weatherData.city}, {weatherData.country}
                                    </div>
                                    <svg
                                        onClick={() => {setCityInput(true)}}
                                        className='pencil' 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        strokeWidth={1} 
                                        stroke="currentColor">
                                            <path  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 
                                                19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 
                                                1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                    </svg>
                                </div>
                            </>
                        ) : (
                            <div className='city-weather-input-container'>
                                <input
                                    className='city-input'
                                    onChange={(e) => {setCity(e.target.value)}}
                                    type="text"
                                    autoFocus={true}
                                    placeholder='enter any city name...' />
                                <svg 
                                    className='city-search-icon' 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    stroke="currentColor">
                                        <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                                <div className='city-weather-functionality'>
                                    <button 
                                        onClick={() => {setCityInput(false)}}
                                        className='cancel-city-btn'>cancel</button>
                                    <button
                                        onClick={changeCityWeather}
                                        className='submit-city-btn'>submit</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="weather-data">
                        {weatherData.nextWeekWeather.map( (day, i) => {
                            return (
                                <div 
                                    key={`${day.temp}-${day.title}-${day.description}`} 
                                    className={`weather-single-day ${(i % 2 == 0) ? 'even-weather' : ''}`}>
                                        <div className='day-name'>{dayNames[i]}</div>
                                        <img 
                                            src={`./../../img/utils/${day.title.toLowerCase()}.png`} 
                                            alt="not found" />
                                        <div className="weather-day-middle-section">
                                            <div className="temperature">{day.temp}  °C</div>
                                            <div className="title">{day.title}</div>
                                        </div>
                                        <div className="weather-day-desc">{day.description}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            }
        </>
    )
}

export default Weather