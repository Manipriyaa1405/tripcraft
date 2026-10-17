import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useTrip } from '../context/TripContext';
import { tripLineShape } from '../propTypes';
import { formatINR } from '../utils/format';
import PageHeader from '../components/PageHeader';
import BudgetRing from '../components/BudgetRing';
import EmptyState from '../components/EmptyState';

function BreakdownBar({ label, value, total, className }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="bar-row">
      <div className="bar-label">
        <span>{label}</span>
        <strong>
          {formatINR(value)} <small className="muted">({pct}%)</small>
        </strong>
      </div>
      <div className="bar-track">
        <div className={`bar-fill ${className}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

BreakdownBar.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  className: PropTypes.string.isRequired,
};

export default function Budget() {
  const { summary, budget, setBudget, toggleActivity, removeDestination } = useTrip();

  return (
    <>
      <PageHeader title="Budget" accent="Planner" subtitle="Estimated costs recalculate every time your itinerary changes." />

      <div className="budget-grid">
        <section className="card">
          <h3>Your budget</h3>
          <label className="budget-input">
            <span className="muted small">Total trip budget (₹)</span>
            <input
              type="number"
              min="0"
              step="5000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </label>

          <BudgetRing spent={summary.total} total={budget} size={140} />

          {summary.overBudget && (
            <p className="alert" role="alert">
              ⚠️ Your itinerary is {formatINR(-summary.remaining)} over budget. Remove an activity or raise the
              budget.
            </p>
          )}
        </section>

        <section className="card">
          <h3>Where the money goes</h3>
          <BreakdownBar label="✈️ Flights" value={summary.flightTotal} total={summary.total} className="b-flight" />
          <BreakdownBar label="🏨 Stay & food" value={summary.stayTotal} total={summary.total} className="b-stay" />
          <BreakdownBar
            label="🎟️ Activities"
            value={summary.activityTotal}
            total={summary.total}
            className="b-act"
          />
          <div className="total-row">
            <span>Estimated total</span>
            <strong>{formatINR(summary.total)}</strong>
          </div>
        </section>
      </div>

      {summary.lines.length === 0 ? (
        <EmptyState
          icon="💰"
          title="Nothing to budget yet"
          message="Add destinations and activities and the cost breakdown will build itself."
          actionTo="/"
        />
      ) : (
        <section className="card">
          <h3>Itemised estimate</h3>
          <div className="table-wrap">
            <table className="cost-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="num">Cost</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {summary.lines.map((line) => (
                  <FragmentRows
                    key={line.destId}
                    line={line}
                    onRemoveActivity={toggleActivity}
                    onRemoveDestination={removeDestination}
                  />
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>Total</td>
                  <td className="num">{formatINR(summary.total)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      )}
    </>
  );
}

function FragmentRows({ line, onRemoveActivity, onRemoveDestination }) {
  const { destination } = line;
  return (
    <Fragment>
      <tr className="group-row">
        <td>
          {destination.emoji} <strong>{destination.name}</strong>{' '}
          <small className="muted">({line.nights} nights)</small>
        </td>
        <td className="num">{formatINR(line.total)}</td>
        <td className="num">
          <button
            type="button"
            className="icon-btn small"
            onClick={() => onRemoveDestination(line.destId)}
            aria-label={`Remove ${destination.name} from trip`}
          >
            ✕
          </button>
        </td>
      </tr>
      <tr>
        <td className="indent">Return flight</td>
        <td className="num">{formatINR(line.flightCost)}</td>
        <td />
      </tr>
      <tr>
        <td className="indent">
          Stay & food ({formatINR(destination.perNight)} × {line.nights})
        </td>
        <td className="num">{formatINR(line.stayCost)}</td>
        <td />
      </tr>
      {line.activities.map((a) => (
        <tr key={a.id}>
          <td className="indent">
            {a.emoji} {a.name}
          </td>
          <td className="num">{a.cost === 0 ? 'Free' : formatINR(a.cost)}</td>
          <td className="num">
            <button
              type="button"
              className="icon-btn small"
              onClick={() => onRemoveActivity(line.destId, a.id)}
              aria-label={`Remove ${a.name}`}
            >
              ✕
            </button>
          </td>
        </tr>
      ))}
    </Fragment>
  );
}

FragmentRows.propTypes = {
  line: tripLineShape.isRequired,
  onRemoveActivity: PropTypes.func.isRequired,
  onRemoveDestination: PropTypes.func.isRequired,
};
