import React, { useState, useEffect } from 'react';
import { fetchWeatherByCity } from '../services/weatherService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLocation, faLocationDot } from '@fortawesome/free-solid-svg-icons';
//import exampleImage from '../assets/images/stormIcon-removebg-preview.png';
import GetWeatherImage from '../utils/GetWeatherImage';

function Home() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState(''); // You can set a default city or let the user input a city
  const [weatherImage, setWeatherImage] = useState(null)
  const [weatherInfoVisible, setWeatherInfoVisible] = useState(false);

  const handleSearchClick = () => {
    // Fetch weather data for the new city
    fetchWeatherByCity(city)
      .then((weatherData) => {
        setWeather(weatherData);
        setWeatherInfoVisible(true)
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        setWeather(null)
        setWeatherInfoVisible(false)
        console.log(weatherImage)
      });
  };

  const handleKeyDown = (event) => {
    // If the Enter key is pressed, fetch weather data for the new city
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  useEffect(() => {
    if(weather !== null){
      setWeatherImage(GetWeatherImage(weather.weather[0].main))
    }
    else {
      setWeatherImage(GetWeatherImage(null))
    }
  },[weather])

  function capitalizeWords(str) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <>
        <h1>Weather App</h1>
        <div className='bg-zinc-600 border border-green-600 rounded-3xl w-2/3 h-5/6 mx-auto '>
            <div className=' w-100 h-16 flex items-center justify-center'>                
                <input 
                  className='py-0 bg-zinc-300 rounded text-center text-zinc-800 w-4/5 placeholder-zinc-500 text-xl' 
                  type="search" 
                  placeholder='Enter City Name'
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  onKeyDown={handleKeyDown}
                ></input>
                <button className='bg-green-300 text-zinc-800 px-2 py-0 rounded' onClick={handleSearchClick}>
                  <FontAwesomeIcon icon={faSearch} className='h-6' />
                </button>
            </div>
            <div className={` flex `}>
              {weather !== null ? (
                <> 
                  <div className='w-2/3 px-2'>
                    <img src={weatherImage} alt='storm' className='' />
                  </div>                    
                  <div className=' px-24 w-1/3 flex flex-col items-center justify-center'>
                      <p className='text-7xl my-2'>{Math.ceil(weather.main.temp)}<span>&#8451;</span></p>
                      <p className='text-2xl '>{capitalizeWords(weather.weather[0].description)}</p>
                  </div>
                </>
            ) :
            (
              <div className='w-full px-2'>
                <img src={weatherImage} alt='unknown' className='' />
              </div>
            )}                
            </div>
            <div className={`bg-zinc-500 ${weatherInfoVisible ? 'h-36' : 'h-auto text-white'}`}>
                {weather !== null ? <h1>Weather info</h1> : <h1>No Matching City Name</h1>}
            </div>
        </div>
    </>
    
  );
}

export default Home;