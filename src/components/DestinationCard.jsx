import PropTypes from 'prop-types';
import { destinationShape } from '../propTypes';
import { startingCost } from '../data/destinations';
import { formatINR } from '../utils/format';

export default function DestinationCard({ destination, selected, inTrip, onSelect, onToggleTrip }) {
  const { name, country, category, emoji, color } = destination;

  return (
    <article className={`dest-card${selected ? ' selected' : ''}`}>
      <button type="button" className="dest-main" onClick={() => onSelect(destination.id)} aria-pressed={selected}>
        <span className="dest-pin" style={{ background: color }} aria-hidden="true">{emoji}</span>
        <span className="dest-text">
          <strong>{name}</strong>
          <small>
            {country} · {category}
          </small>
        </span>
        <span className="dest-price">
          <small>from</small>
          {formatINR(startingCost(destination))}
        </span>
      </button>
      <button
        type="button"
        className={`icon-btn${inTrip ? ' added' : ''}`}
        onClick={() => onToggleTrip(destination.id)}
        aria-label={inTrip ? `Remove ${name} from trip` : `Add ${name} to trip`}
        title={inTrip ? 'Remove from trip' : 'Add to trip'}
      >
        {inTrip ? '✓' : '+'}
      </button>
    </article>
  );
}

DestinationCard.propTypes = {
  destination: destinationShape.isRequired,
  selected: PropTypes.bool,
  inTrip: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onToggleTrip: PropTypes.func.isRequired,
};

DestinationCard.defaultProps = {
  selected: false,
  inTrip: false,
};
