import PropTypes from 'prop-types';
import useWeather, { describeWeather } from '../hooks/useWeather';

const weekday = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short' });

/**
 * Live weather from the Open-Meteo API.
 * variant="compact" -> one-line current conditions, variant="full" -> current + 5-day forecast.
 */
export default function WeatherPanel({ lat, lng, variant }) {
  const { data, loading, error } = useWeather(lat, lng);

  if (loading) return <div className="weather skeleton">Loading live weather…</div>;
  if (error || !data) return <div className="weather weather-error">Weather unavailable right now.</div>;

  const now = describeWeather(data.current.weather_code);
  const unit = data.current_units.temperature_2m;

  if (variant === 'compact') {
    return (
      <div className="weather weather-compact" title={now.label}>
        <span aria-hidden="true">{now.icon}</span>
        <strong>
          {Math.round(data.current.temperature_2m)}
          {unit}
        </strong>
        <small>{now.label}</small>
      </div>
    );
  }

  return (
    <div className="weather weather-full">
      <div className="weather-now">
        <span className="weather-icon" aria-hidden="true">{now.icon}</span>
        <div>
          <strong className="weather-temp">
            {Math.round(data.current.temperature_2m)}
            {unit}
          </strong>
          <small>
            {now.label} · wind {Math.round(data.current.wind_speed_10m)} km/h · humidity{' '}
            {data.current.relative_humidity_2m}%
          </small>
        </div>
      </div>
      <ul className="forecast">
        {data.daily.time.map((day, i) => {
          const w = describeWeather(data.daily.weather_code[i]);
          return (
            <li key={day} title={w.label}>
              <small>{i === 0 ? 'Today' : weekday(day)}</small>
              <span aria-hidden="true">{w.icon}</span>
              <strong>{Math.round(data.daily.temperature_2m_max[i])}°</strong>
              <small>{Math.round(data.daily.temperature_2m_min[i])}°</small>
            </li>
          );
        })}
      </ul>
      <small className="muted attribution">Live data from Open-Meteo.com</small>
    </div>
  );
}

WeatherPanel.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  variant: PropTypes.oneOf(['compact', 'full']),
};

WeatherPanel.defaultProps = {
  variant: 'full',
};
