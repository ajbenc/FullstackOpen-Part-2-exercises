const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeather = async (lat, lon, apiKey) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Weather data not found');
    }
    return await response.json();
  } catch (error) {
    console.error('Weather fetch error:', error);
    throw new Error(`Failed to get weather: ${error.message}`);
  }
};

export const getCoordinates = async (city, apiKey) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'City not found');
    }
    const data = await response.json();
    if (!data.length) throw new Error('City not found');
    return { lat: data[0].lat, lon: data[0].lon };
  } catch (error) {
    console.error('Coordinates fetch error:', error);
    throw new Error(`Failed to get coordinates: ${error.message}`);
  }
};