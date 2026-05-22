/**
 * BharatFarm Weather Service
 * Uses Open-Meteo (free, no API key needed) for weather data
 */

const WEATHER_ICONS = {
  0: { icon: 'sun', label: 'Clear Sky', emoji: '☀️' },
  1: { icon: 'sun', label: 'Mainly Clear', emoji: '🌤️' },
  2: { icon: 'cloud', label: 'Partly Cloudy', emoji: '⛅' },
  3: { icon: 'cloud', label: 'Overcast', emoji: '☁️' },
  45: { icon: 'cloud', label: 'Foggy', emoji: '🌫️' },
  48: { icon: 'cloud', label: 'Depositing Rime Fog', emoji: '🌫️' },
  51: { icon: 'cloud-drizzle', label: 'Light Drizzle', emoji: '🌦️' },
  53: { icon: 'cloud-drizzle', label: 'Moderate Drizzle', emoji: '🌦️' },
  55: { icon: 'cloud-drizzle', label: 'Dense Drizzle', emoji: '🌧️' },
  61: { icon: 'cloud-rain', label: 'Slight Rain', emoji: '🌧️' },
  63: { icon: 'cloud-rain', label: 'Moderate Rain', emoji: '🌧️' },
  65: { icon: 'cloud-rain', label: 'Heavy Rain', emoji: '🌧️' },
  71: { icon: 'cloud-snow', label: 'Slight Snow', emoji: '🌨️' },
  73: { icon: 'cloud-snow', label: 'Moderate Snow', emoji: '🌨️' },
  75: { icon: 'cloud-snow', label: 'Heavy Snow', emoji: '❄️' },
  80: { icon: 'cloud-rain', label: 'Rain Showers', emoji: '🌦️' },
  81: { icon: 'cloud-rain', label: 'Moderate Showers', emoji: '🌧️' },
  82: { icon: 'cloud-rain', label: 'Violent Showers', emoji: '⛈️' },
  95: { icon: 'cloud-lightning', label: 'Thunderstorm', emoji: '⛈️' },
  96: { icon: 'cloud-lightning', label: 'Thunderstorm with Hail', emoji: '⛈️' },
  99: { icon: 'cloud-lightning', label: 'Thunderstorm with Heavy Hail', emoji: '⛈️' },
};

export function getWeatherInfo(code) {
  return WEATHER_ICONS[code] || { icon: 'cloud', label: 'Unknown', emoji: '🌡️' };
}

export function getFarmingSafetyLevel(weatherCode, windSpeed, temp) {
  if ([95, 96, 99].includes(weatherCode)) return { level: 'DANGER', color: '#EF4444', message: 'Thunderstorm! Stay indoors.' };
  if ([65, 82].includes(weatherCode)) return { level: 'WARNING', color: '#F59E0B', message: 'Heavy rain. Avoid field work.' };
  if (windSpeed > 50) return { level: 'WARNING', color: '#F59E0B', message: 'High winds. Secure equipment.' };
  if (temp > 42) return { level: 'CAUTION', color: '#F59E0B', message: 'Extreme heat. Work in early morning.' };
  if (temp < 5) return { level: 'CAUTION', color: '#3B82F6', message: 'Cold conditions. Protect crops.' };
  return { level: 'SAFE', color: '#22C55E', message: 'Conditions suitable for farming.' };
}

export async function fetchWeatherByCoords(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=7`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch weather data: ' + error.message);
  }
}

export async function geocodeCity(cityName) {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=5&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Geocoding failed');
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    throw new Error('Location search failed: ' + error.message);
  }
}
