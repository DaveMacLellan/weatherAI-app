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
  const [suggestions, setSuggestions] = useState(null);
  const [prompt, setPrompt] = useState(null)

  const openAIAPIKey = import.meta.env.VITE_OPENAI_API_KEY
  
  const handleSearchClick = () => {
    // Fetch weather data for the new city
    fetchWeatherByCity(city)
      .then(async (weatherData) => {
        setWeather(weatherData);
        setWeatherInfoVisible(true);
        await fetchOpenAISuggestions(weatherData);
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
    //set weather image if weather data is not null
    if(weather !== null){
      setWeatherImage(GetWeatherImage(weather.weather[0].main))
    }
    else {
      setWeatherImage(GetWeatherImage(null))
    }
  },[weather])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!prompt) {
        return;
      }
  
      try {
        const response = await fetch(
          'https://api.openai.com/v1/engines/text-davinci-003/completions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${openAIAPIKey}`,
            },
            body: JSON.stringify({
              prompt: prompt,
              max_tokens: 80,
              n: 1,
              stop: null,
              temperature: 0.8,
            }),
          }
        );
  
        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
          const suggestion = data.choices[0].text.trim();
          setSuggestions(suggestion);
        } else {
          console.error('OpenAI API returned no choices:', data);
        }
      } catch (error) {
        console.error('Error fetching OpenAI suggestions:', error);
      }
    };
  
    fetchSuggestions();
  }, [prompt]);

  const fetchOpenAISuggestions = (weatherData) => {
    const temperature = weatherData.main.temp;
    const weatherDescription = weatherData.weather[0].description;
    const precipitation = weatherData.weather[0].main;
  
    let promptText = `Based on the current weather condition with a temperature of ${Math.ceil(
      temperature
    )}°C and ${weatherDescription}, what clothing should be worn?`;
  
    if (precipitation === 'Snow') {
      promptText += ' If snow, bring a snow brush.';
    }
    if (precipitation === 'Rain') {
      promptText += ' If rain, bring an umbrella.';
    }
  
    setPrompt(promptText);
  }; 
  

  function capitalizeWords(str) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function formatTime(timestamp, timeZoneOffsetInSeconds) {
    const adjustedTimestamp = timestamp + timeZoneOffsetInSeconds;
    const date = new Date(adjustedTimestamp * 1000);
  
    const formattedTime = date.toLocaleString('en-US', {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  
    return formattedTime;
  }  

  function convertWindSpeed(wind){
    const windKm = wind * 3.6
    return Math.ceil(windKm)
  }
  
  return (
    <div>
        <h1>Weather App</h1>
        <div className='w-full sm:w-5/6 md:w-1/3 lg:w-1/3 bg-zinc-600 rounded-3xl mx-auto '>
            <div className=' w-100 h-16 flex items-center justify-center'>                
                <input 
                  className='h-7 py-0 bg-zinc-300 rounded-l text-center text-zinc-800 w-4/5 placeholder-zinc-500 text-xl' 
                  type="search" 
                  placeholder='Enter City Name'
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  onKeyDown={handleKeyDown}
                ></input>
                <button className='h-7 bg-green-300 text-zinc-800 px-2 py-0 rounded-r' onClick={handleSearchClick}>
                  <FontAwesomeIcon icon={faSearch} className='h-4' />
                </button>
            </div>
            <div className={`flex`}>
              {weather !== null ? (
                <> 
                  <div className='w-2/3 px-2'>
                    <img src={weatherImage} alt='storm' className='' />
                  </div>                    
                  <div className='w-1/3 px-8 flex flex-col items-center justify-center'>
                      <p className='text-4xl sm:w-text-6xl md:text-3xl lg:text-4xl my-2'>{Math.ceil(weather.main.temp)}<span>&#8451;</span></p>
                      <p className='text-xl sm:w-text-xl md:text-xl lg:text-xl '>{capitalizeWords(weather.weather[0].description)}</p>
                  </div>
                </>
            ) :
            (
              <div className='w-full h-80 px-2'>
                <img src={weatherImage} alt='unknown' className='h-auto max-h-full mx-auto' />
              </div>
            )}                
            </div>
            <div className={`bg-zinc-500 ${weatherInfoVisible ? 'h-16 text-white' : 'h-auto text-white'}`}>
                {weather !== null ? 
                    <div className='h-full flex justify-around rounded-b-3xl'>
                      <div className='w-1/2 h-full flex flex-col justify-around '>
                        <h1>Sunrise: {formatTime(weather.sys.sunrise, weather.timezone)}</h1>
                        <h1>Sunset: {formatTime(weather.sys.sunset, weather.timezone)}</h1>
                      </div>
                      <div className='w-1/2 h-full flex flex-col justify-around'>
                        <h1>Wind: {convertWindSpeed(weather.wind.speed)} KM</h1>
                        <h1>Feels Like: {Math.ceil(weather.main.feels_like)}<span>&#8451;</span></h1>
                      </div>
                    </div> 
                  : 
                    <>
                      <h1>No Matching City Name</h1>
                    </>                
                }
            </div>
        </div>
        {suggestions && (
        <div className='bg-zinc-500 rounded-b-3xl'>
          <h2 className='pt-2 text-white'>Weather Attire Suggestions</h2>
          <p className='px-2 pb-2 text-sm text-white'>{suggestions}</p>
        </div>
      )}
    </div>    
  );
}

export default Home;