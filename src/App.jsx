import { useWeatherData } from './hooks/useWeatherData';
import SearchBar from './components/SearchBar/SearchBar';
import CountryInfo from './components/CountryInfo/CountryInfo';
import WeatherInfo from './Components/WeatherInfo/WeatherInfo';
import './App.css';

const App = () => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const { weather, country, loading, error, fetchWeather } = useWeatherData(apiKey);

  if (!apiKey) {
    return (
      <div className="app-container">
        <h1>Configuration Error</h1>
        <p>Please check your API key in the .env file</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <h1>Country Weather Finder</h1>
        <SearchBar onSelectCountry={fetchWeather} />
      </header>
      
      <main>
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
        
        {!loading && !error && (
          <>
            {country && <CountryInfo country={country} />}
            {weather && <WeatherInfo weather={weather} />}
          </>
        )}
      </main>
    </div>
  );
};

export default App;