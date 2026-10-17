import PropTypes from 'prop-types';

export const activityShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  cost: PropTypes.number.isRequired,
  duration: PropTypes.string.isRequired,
  emoji: PropTypes.string.isRequired,
});

export const destinationShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  emoji: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  flight: PropTypes.number.isRequired,
  perNight: PropTypes.number.isRequired,
  bestTime: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  highlights: PropTypes.arrayOf(PropTypes.string).isRequired,
  activities: PropTypes.arrayOf(activityShape).isRequired,
});

// A derived line from computeSummary(): destination + dates + chosen activities + costs.
export const tripLineShape = PropTypes.shape({
  destId: PropTypes.string.isRequired,
  destination: destinationShape.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  nights: PropTypes.number.isRequired,
  activities: PropTypes.arrayOf(activityShape).isRequired,
  flightCost: PropTypes.number.isRequired,
  stayCost: PropTypes.number.isRequired,
  activityCost: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
});
