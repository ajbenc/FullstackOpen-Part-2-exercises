import './WeatherInfo.css'
const WeatherInfo = ({ weather }) => {
  if (!weather) return null;

  return (
    <div className="weather-info">
      <h3>Weather in {weather.name}</h3>
      <div className="weather-details">
        <div className="temperature">
          <span>{Math.round(weather.main.temp)}°C</span>
          {weather.weather[0].icon && (
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Weather icon"
            />
          )}
        </div>
        <div className="weather-meta">
          <p><strong>Condition:</strong> {weather.weather[0].description}</p>
          <p><strong>Wind:</strong> {weather.wind.speed} m/s</p>
          <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherInfo;