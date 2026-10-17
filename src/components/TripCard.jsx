import PropTypes from 'prop-types';
import { tripLineShape } from '../propTypes';
import { formatINR, formatRange } from '../utils/format';

/** Overview card for one planned destination (My Trips page). */
export default function TripCard({ line, onRemove, onOpen }) {
  const { destination } = line;

  return (
    <article className="card trip-card">
      <div className="trip-card-hero" style={{ '--hero': destination.color }}>
        <span aria-hidden="true">{destination.emoji}</span>
      </div>
      <div className="trip-card-body">
        <h3>
          {destination.name}, {destination.country}
        </h3>
        <p className="muted small">
          {formatRange(line.startDate, line.nights)} · {line.nights} nights
        </p>
        <ul className="stat-row">
          <li>
            <small>Activities</small>
            <strong>{line.activities.length}</strong>
          </li>
          <li>
            <small>Trip cost</small>
            <strong>{formatINR(line.total)}</strong>
          </li>
        </ul>
        <div className="btn-row">
          <button type="button" className="btn btn-soft" onClick={() => onOpen(destination.id)}>
            Plan details
          </button>
          <button type="button" className="btn btn-danger-outline" onClick={() => onRemove(destination.id)}>
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}

TripCard.propTypes = {
  line: tripLineShape.isRequired,
  onRemove: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
};
