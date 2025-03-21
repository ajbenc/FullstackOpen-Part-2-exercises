import { useState } from 'react';
import { getCoordinates, getWeather } from '../services/weatherService'; // Verify path case

export const useWeatherData = (apiKey) => {
  const [weather, setWeather] = useState(null);
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (country) => {
    if (!country?.capital?.[0] || !apiKey) {
      setError('Invalid country or API key');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const coords = await getCoordinates(country.capital[0], apiKey);
      const weatherData = await getWeather(coords.lat, coords.lon, apiKey);
      setWeather(weatherData);
      setCountry(country);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return { weather, country, loading, error, fetchWeather };
};