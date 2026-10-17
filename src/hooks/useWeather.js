import { useEffect, useState } from 'react';

// Open-Meteo is a free third-party weather API that needs no API key,
// so there is no secret to hide in the public source code.
const ENDPOINT = 'https://api.open-meteo.com/v1/forecast';

const cache = new Map();

/** WMO weather interpretation codes -> emoji + label. */
export function describeWeather(code) {
  if (code === 0) return { icon: '☀️', label: 'Clear' };
  if (code <= 2) return { icon: '⛅', label: 'Partly cloudy' };
  if (code === 3) return { icon: '☁️', label: 'Overcast' };
  if (code <= 48) return { icon: '🌫️', label: 'Fog' };
  if (code <= 57) return { icon: '🌦️', label: 'Drizzle' };
  if (code <= 67) return { icon: '🌧️', label: 'Rain' };
  if (code <= 77) return { icon: '❄️', label: 'Snow' };
  if (code <= 82) return { icon: '🌧️', label: 'Showers' };
  if (code <= 86) return { icon: '🌨️', label: 'Snow showers' };
  return { icon: '⛈️', label: 'Thunderstorm' };
}

/** Fetches current conditions + a 5-day forecast for a coordinate. */
export default function useWeather(lat, lng) {
  const key = `${lat},${lng}`;
  const [state, setState] = useState(() => ({
    data: cache.get(key) ?? null,
    loading: !cache.has(key),
    error: null,
  }));

  useEffect(() => {
    if (cache.has(key)) {
      setState({ data: cache.get(key), loading: false, error: null });
      return undefined;
    }

    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });

    const params = new URLSearchParams({
      latitude: lat,
      longitude: lng,
      current: 'temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min',
      timezone: 'auto',
      forecast_days: '5',
    });

    fetch(`${ENDPOINT}?${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Weather service returned ${res.status}`);
        return res.json();
      })
      .then((json) => {
        cache.set(key, json);
        setState({ data: json, loading: false, error: null });
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setState({ data: null, loading: false, error: err.message });
      });

    return () => controller.abort();
  }, [key, lat, lng]);

  return state;
}
