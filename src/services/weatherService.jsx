// services/weatherService.js

const API_KEY = 'openweatherAPIKEY'; // Replace this with your OpenWeather API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function fetchWeatherByCity(city) {
  const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
  
  if (!response.ok) {
    throw new Error(`Error fetching weather data: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
}
