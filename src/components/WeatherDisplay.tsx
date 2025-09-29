import { WeatherData } from '../types/weather';
import { getWeatherDescription } from '../utils/weatherCodes';
import './WeatherDisplay.css';

interface WeatherDisplayProps {
  data: WeatherData;
  city: string;
  country: string;
}

export const WeatherDisplay = ({ data, city, country }: WeatherDisplayProps) => {
  const { current, daily } = data;

  const formatWindDirection = (degrees: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  return (
    <div className="weather-display">
      <div className="weather-header">
        <h2>{city}, {country}</h2>
        <p className="weather-description">{getWeatherDescription(current.weather_code)}</p>
      </div>

      <div className="weather-current">
        <div className="temperature-main">
          <span className="temp-value">{Math.round(current.temperature_2m)}</span>
          <span className="temp-unit">°C</span>
        </div>
        <p className="feels-like">Feels like {Math.round(current.apparent_temperature)}°C</p>
      </div>

      <div className="weather-details">
        <div className="detail-card">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{current.relative_humidity_2m}%</span>
        </div>
        <div className="detail-card">
          <span className="detail-label">Wind</span>
          <span className="detail-value">
            {Math.round(current.wind_speed_10m)} km/h {formatWindDirection(current.wind_direction_10m)}
          </span>
        </div>
        <div className="detail-card">
          <span className="detail-label">Precipitation</span>
          <span className="detail-value">{current.precipitation} mm</span>
        </div>
      </div>

      <div className="weather-forecast">
        <h3>3-Day Forecast</h3>
        <div className="forecast-grid">
          {daily.temperature_2m_max.map((maxTemp, index) => (
            <div key={index} className="forecast-card">
              <span className="forecast-day">
                {index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : `Day ${index + 1}`}
              </span>
              <div className="forecast-temps">
                <span className="temp-max">{Math.round(maxTemp)}°</span>
                <span className="temp-separator">/</span>
                <span className="temp-min">{Math.round(daily.temperature_2m_min[index])}°</span>
              </div>
              {daily.precipitation_sum[index] > 0 && (
                <span className="forecast-precip">
                  {daily.precipitation_sum[index].toFixed(1)} mm
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};