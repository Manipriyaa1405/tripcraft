import PropTypes from 'prop-types';
import { formatINR } from '../utils/format';

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Donut chart (pure SVG) showing how much of the budget the current itinerary uses. */
export default function BudgetRing({ spent, total, size }) {
  const ratio = total > 0 ? spent / total : 0;
  const over = ratio > 1;
  const shown = Math.min(ratio, 1);

  return (
    <div className="budget-ring">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        role="img"
        aria-label={`${Math.round(ratio * 100)} percent of budget used`}
      >
        <circle cx="50" cy="50" r={RADIUS} className="ring-track" />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          className={`ring-value${over ? ' over' : ''}`}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - shown)}
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="55" textAnchor="middle" className="ring-text">
          {Math.round(ratio * 100)}%
        </text>
      </svg>
      <dl className="ring-legend">
        <div>
          <dt>Planned</dt>
          <dd>{formatINR(spent)}</dd>
        </div>
        <div>
          <dt>{over ? 'Over by' : 'Remaining'}</dt>
          <dd className={over ? 'negative' : ''}>{formatINR(Math.abs(total - spent))}</dd>
        </div>
      </dl>
    </div>
  );
}

BudgetRing.propTypes = {
  spent: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  size: PropTypes.number,
};

BudgetRing.defaultProps = {
  size: 96,
};
