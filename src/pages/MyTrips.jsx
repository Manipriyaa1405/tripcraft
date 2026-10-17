import { useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { formatINR } from '../utils/format';
import PageHeader from '../components/PageHeader';
import TripCard from '../components/TripCard';
import EmptyState from '../components/EmptyState';

export default function MyTrips() {
  const { summary, removeDestination, clearTrip } = useTrip();
  const navigate = useNavigate();

  const openInItinerary = (destId) => navigate('/itinerary', { state: { focus: destId } });

  return (
    <>
      <PageHeader title="My" accent="Trips" subtitle="Every destination you have added, at a glance.">
        {summary.lines.length > 0 && (
          <button type="button" className="btn btn-danger-outline" onClick={clearTrip}>
            Clear all
          </button>
        )}
      </PageHeader>

      {summary.lines.length === 0 ? (
        <EmptyState
          title="No trips yet"
          message="Browse the Explore page and add a destination to start planning."
          actionTo="/"
        />
      ) : (
        <>
          <ul className="stat-tiles">
            <li className="card">
              <small>Destinations</small>
              <strong>{summary.lines.length}</strong>
            </li>
            <li className="card">
              <small>Total nights</small>
              <strong>{summary.nights}</strong>
            </li>
            <li className="card">
              <small>Activities</small>
              <strong>{summary.activityCount}</strong>
            </li>
            <li className="card">
              <small>Estimated cost</small>
              <strong>{formatINR(summary.total)}</strong>
            </li>
          </ul>

          <div className="trip-grid">
            {summary.lines.map((line) => (
              <TripCard key={line.destId} line={line} onRemove={removeDestination} onOpen={openInItinerary} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
