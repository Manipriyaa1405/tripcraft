import { Link } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { formatINR, formatRange } from '../utils/format';
import BudgetRing from './BudgetRing';

/** Sidebar widget on the Explore page: the trip so far, total cost and budget status. */
export default function TripSummaryCard() {
  const { summary, removeDestination } = useTrip();

  return (
    <>
      <section className="card">
        <div className="card-head">
          <h3>🧳 My Trip</h3>
          <Link to="/my-trips" className="link">
            View all →
          </Link>
        </div>

        {summary.lines.length === 0 ? (
          <p className="muted small">Nothing planned yet. Press + on a destination to start.</p>
        ) : (
          <ul className="trip-mini">
            {summary.lines.map((line) => (
              <li key={line.destId}>
                <span className="dot" style={{ background: line.destination.color }} />
                <div>
                  <strong>
                    {line.destination.name}, {line.destination.country}
                  </strong>
                  <small>{formatRange(line.startDate, line.nights)}</small>
                </div>
                <button
                  type="button"
                  className="icon-btn small"
                  onClick={() => removeDestination(line.destId)}
                  aria-label={`Remove ${line.destination.name}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="total-row">
          <span>Total cost</span>
          <strong>{formatINR(summary.total)}</strong>
        </div>
        <Link to="/itinerary" className="btn btn-primary btn-block">
          View itinerary →
        </Link>
      </section>

      <section className="card">
        <h3>📊 Budget Overview</h3>
        <BudgetRing spent={summary.total} total={summary.budget} />
      </section>
    </>
  );
}
