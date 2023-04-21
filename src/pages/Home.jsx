import React, { useState, useEffect } from 'react';
import { fetchWeatherByCity } from '../services/weatherService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLocation, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import exampleImage from '../assets/images/stormIcon-removebg-preview.png';

function Home() {
  /*const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('New York'); // You can set a default city or let the user input a city

  useEffect(() => {
    async function fetchData() {
      try {
        const weatherData = await fetchWeatherByCity(city);
        setWeather(weatherData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    }

    fetchData();
  }, [city]);
  */

  return (
    <>
        <h1>Weather App</h1>
        <div className='bg-zinc-600 border border-green-600 rounded-3xl w-2/3 h-5/6 mx-auto '>
            <div className=' w-100 h-16 flex items-center justify-center'>                
                <input className='py-0 bg-zinc-300 rounded text-center text-zinc-800 w-4/5 placeholder-zinc-500 text-xl' type="search" placeholder='Enter City Name'></input>
                <FontAwesomeIcon icon={faSearch} className='text-green-300 h-6 px-2 py-0' />
            </div>
            <div className=' flex'>
                <div className='w-2/3 px-2'>
                    <img src={exampleImage} alt='storm' className='' />
                </div>
                <div className=' px-16 w-1/3 flex flex-col items-center justify-center'>
                    <p className='text-7xl mx-10'>5<span>&#8451;</span></p>
                    <p className='text-3xl '>Thunder Storms</p>
                </div>
            </div>
            <div className='h-36 bg-zinc-500'>
                <h1>Weather info</h1>
            </div>
        </div>
    </>
    
  );
}

export default Home;