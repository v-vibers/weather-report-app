import { useState } from 'react';
import { WeatherData } from '../types/weather';
import { getCoordinates, getWeatherData } from '../services/weatherApi';
import { WeatherDisplay } from './WeatherDisplay';
import './WeatherApp.css';

export const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedLocation, setSearchedLocation] = useState<{
    city: string;
    country: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const coords = await getCoordinates(city, country);
      const data = await getWeatherData(coords.latitude, coords.longitude);
      setWeatherData(data);
      setSearchedLocation({ city, country });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-app">
      <div className="weather-container">
        <h1 className="app-title">Weather Report</h1>

        <form onSubmit={handleSubmit} className="weather-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="form-input"
              disabled={loading}
              aria-label="City"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Enter country (optional)"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="form-input"
              disabled={loading}
              aria-label="Country"
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Loading...
              </>
            ) : (
              'Get Weather'
            )}
          </button>
        </form>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        {weatherData && searchedLocation && (
          <WeatherDisplay
            data={weatherData}
            city={searchedLocation.city}
            country={searchedLocation.country}
          />
        )}
      </div>
    </div>
  );
};