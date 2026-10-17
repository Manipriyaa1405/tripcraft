import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { tripLineShape } from '../propTypes';
import { useTrip } from '../context/TripContext';
import { formatINR, formatRange } from '../utils/format';
import PageHeader from '../components/PageHeader';
import ActivityItem from '../components/ActivityItem';
import WeatherPanel from '../components/WeatherPanel';
import EmptyState from '../components/EmptyState';

function ItineraryStop({ line, index, highlighted, onUpdate, onToggleActivity, onRemove }) {
  const ref = useRef(null);
  const { destination } = line;

  useEffect(() => {
    if (highlighted) ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [highlighted]);

  return (
    <li ref={ref} className={`stop card${highlighted ? ' highlight' : ''}`}>
      <div className="stop-marker" style={{ background: destination.color }}>
        {index + 1}
      </div>

      <div className="stop-body">
        <div className="stop-head">
          <div>
            <h3>
              {destination.emoji} {destination.name}, {destination.country}
            </h3>
            <p className="muted small">{formatRange(line.startDate, line.nights)}</p>
          </div>
          <div className="stop-head-right">
            <WeatherPanel lat={destination.lat} lng={destination.lng} variant="compact" />
            <button type="button" className="btn btn-danger-outline" onClick={() => onRemove(line.destId)}>
              Remove
            </button>
          </div>
        </div>

        <div className="stop-controls">
          <label>
            <span className="small muted">Start date</span>
            <input
              type="date"
              value={line.startDate}
              onChange={(e) => e.target.value && onUpdate(line.destId, { startDate: e.target.value })}
            />
          </label>
          <label>
            <span className="small muted">Nights</span>
            <input
              type="number"
              min="1"
              max="30"
              value={line.nights}
              onChange={(e) =>
                onUpdate(line.destId, { nights: Math.min(30, Math.max(1, Number(e.target.value) || 1)) })
              }
            />
          </label>
          <div className="stop-cost">
            <span className="small muted">Stop total</span>
            <strong>{formatINR(line.total)}</strong>
          </div>
        </div>

        <h4>Activities ({line.activities.length} planned)</h4>
        <div className="activity-list">
          {destination.activities.map((a) => (
            <ActivityItem
              key={a.id}
              activity={a}
              checked={line.activities.some((x) => x.id === a.id)}
              onToggle={(activityId) => onToggleActivity(line.destId, activityId)}
            />
          ))}
        </div>
      </div>
    </li>
  );
}

ItineraryStop.propTypes = {
  line: tripLineShape.isRequired,
  index: PropTypes.number.isRequired,
  highlighted: PropTypes.bool,
  onUpdate: PropTypes.func.isRequired,
  onToggleActivity: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

ItineraryStop.defaultProps = {
  highlighted: false,
};

export default function Itinerary() {
  const { summary, updateTrip, toggleActivity, removeDestination } = useTrip();
  const location = useLocation();
  const focusId = location.state?.focus ?? null;

  return (
    <>
      <PageHeader
        title="Your"
        accent="Itinerary"
        subtitle="Set dates, pick activities and watch the cost update instantly."
      >
        <div className="header-total">
          <small className="muted">Trip total</small>
          <strong>{formatINR(summary.total)}</strong>
        </div>
      </PageHeader>

      {summary.lines.length === 0 ? (
        <EmptyState
          icon="🗺️"
          title="Your itinerary is empty"
          message="Add destinations from Explore and they will appear here in date order."
          actionTo="/"
        />
      ) : (
        <ol className="timeline">
          {summary.lines.map((line, i) => (
            <ItineraryStop
              key={line.destId}
              line={line}
              index={i}
              highlighted={line.destId === focusId}
              onUpdate={updateTrip}
              onToggleActivity={toggleActivity}
              onRemove={removeDestination}
            />
          ))}
        </ol>
      )}
    </>
  );
}
