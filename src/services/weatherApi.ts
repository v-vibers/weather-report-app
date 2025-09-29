import { WeatherData, GeocodingResult } from '../types/weather';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

export const getCoordinates = async (
  city: string,
  country: string
): Promise<{ latitude: number; longitude: number }> => {
  const params = new URLSearchParams({
    name: city,
    count: '5',
    language: 'en',
    format: 'json',
  });

  const response = await fetch(`${GEOCODING_API}?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch location data');
  }

  const data: GeocodingResult = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error('Location not found');
  }

  // Filter by country if provided
  let result = data.results[0];
  if (country) {
    const countryMatch = data.results.find(
      (r) => r.country.toLowerCase() === country.toLowerCase()
    );
    if (countryMatch) {
      result = countryMatch;
    }
  }

  return {
    latitude: result.latitude,
    longitude: result.longitude,
  };
};

export const getWeatherData = async (
  latitude: number,
  longitude: number
): Promise<WeatherData> => {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
    ].join(','),
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
    timezone: 'auto',
    forecast_days: '3',
  });

  const response = await fetch(`${WEATHER_API}?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data: WeatherData = await response.json();
  return data;
};