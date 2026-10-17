import PropTypes from 'prop-types';
import { activityShape } from '../propTypes';
import { formatINR } from '../utils/format';

/** A single activity row with a checkbox. Used on the Explore detail panel and the Itinerary page. */
export default function ActivityItem({ activity, checked, onToggle }) {
  return (
    <label className={`activity${checked ? ' checked' : ''}`}>
      <input type="checkbox" checked={checked} onChange={() => onToggle(activity.id)} />
      <span className="activity-emoji" aria-hidden="true">{activity.emoji}</span>
      <span className="activity-text">
        <strong>{activity.name}</strong>
        <small>{activity.duration}</small>
      </span>
      <span className="activity-cost">{activity.cost === 0 ? 'Free' : formatINR(activity.cost)}</span>
    </label>
  );
}

ActivityItem.propTypes = {
  activity: activityShape.isRequired,
  checked: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
};

ActivityItem.defaultProps = {
  checked: false,
};
