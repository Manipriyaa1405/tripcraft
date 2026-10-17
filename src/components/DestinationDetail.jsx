import PropTypes from 'prop-types';
import { destinationShape } from '../propTypes';
import { DEFAULT_NIGHTS, startingCost } from '../data/destinations';
import { formatINR } from '../utils/format';
import { useTrip } from '../context/TripContext';
import ActivityItem from './ActivityItem';
import WeatherPanel from './WeatherPanel';

/** Detail panel for the destination currently selected on the Explore page. */
export default function DestinationDetail({ destination }) {
  const { trip, tripIds, addDestination, removeDestination, toggleActivity } = useTrip();
  const inTrip = tripIds.has(destination.id);
  const chosen = trip.find((t) => t.destId === destination.id)?.activities ?? [];

  return (
    <section className="card detail" aria-live="polite">
      <div className="detail-hero" style={{ '--hero': destination.color }}>
        <span className="detail-emoji" aria-hidden="true">{destination.emoji}</span>
        <div>
          <h2>
            {destination.name}, <span>{destination.country}</span>
          </h2>
          <p>{destination.description}</p>
        </div>
      </div>

      <div className="detail-facts">
        <div>
          <small>Category</small>
          <strong>{destination.category}</strong>
        </div>
        <div>
          <small>Best time</small>
          <strong>{destination.bestTime}</strong>
        </div>
        <div>
          <small>Est. {DEFAULT_NIGHTS} nights</small>
          <strong>{formatINR(startingCost(destination))}</strong>
        </div>
      </div>

      <ul className="tag-list">
        {destination.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>

      <h3>Weather now</h3>
      <WeatherPanel lat={destination.lat} lng={destination.lng} variant="full" />

      <h3>Activities</h3>
      <div className="activity-list">
        {destination.activities.map((a) => (
          <ActivityItem
            key={a.id}
            activity={a}
            checked={chosen.includes(a.id)}
            onToggle={(activityId) => toggleActivity(destination.id, activityId)}
          />
        ))}
      </div>

      <button
        type="button"
        className={`btn ${inTrip ? 'btn-danger-outline' : 'btn-primary'} btn-block`}
        onClick={() => (inTrip ? removeDestination(destination.id) : addDestination(destination.id))}
      >
        {inTrip ? 'Remove from my trip' : 'Add to my trip'}
      </button>
    </section>
  );
}

DestinationDetail.propTypes = {
  destination: destinationShape.isRequired,
};
