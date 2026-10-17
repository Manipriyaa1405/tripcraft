import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function EmptyState({ icon, title, message, actionLabel, actionTo }) {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">{icon}</div>
      <h3>{title}</h3>
      <p className="muted">{message}</p>
      {actionTo && (
        <Link to={actionTo} className="btn btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  actionLabel: PropTypes.string,
  actionTo: PropTypes.string,
};

EmptyState.defaultProps = {
  icon: '🧳',
  actionLabel: 'Explore destinations',
  actionTo: '',
};
