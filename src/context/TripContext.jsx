import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';
import { DEFAULT_NIGHTS, getDestination } from '../data/destinations';
import { addDays, todayISO } from '../utils/format';
import { computeSummary } from '../utils/trip';

const STORAGE_KEY = 'tripcraft:v1';
const DEFAULT_BUDGET = 150000;

const initialState = { trip: [], budget: DEFAULT_BUDGET };

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.trip) && typeof saved.budget === 'number') {
      return { ...saved, trip: saved.trip.filter((t) => getDestination(t.destId)) };
    }
  } catch {
    /* ignore corrupt or unavailable storage */
  }
  return initialState;
}

const newItem = (destId, startDate) => ({
  destId,
  startDate,
  nights: DEFAULT_NIGHTS,
  activities: [],
});

/** Next free start date: the day after the latest planned trip ends, else `fallbackStart`. */
function nextStart(trip, fallbackStart) {
  if (trip.length === 0) return fallbackStart;
  const latestEnd = trip
    .map((t) => addDays(t.startDate, t.nights))
    .sort()
    .at(-1);
  return addDays(latestEnd, 1);
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_DESTINATION': {
      if (state.trip.some((t) => t.destId === action.destId)) return state;
      const start = nextStart(state.trip, action.fallbackStart);
      return { ...state, trip: [...state.trip, newItem(action.destId, start)] };
    }

    // One action removes the destination AND every activity under it, because the
    // activities live inside the trip item. Nothing else needs to be told.
    case 'REMOVE_DESTINATION':
      return { ...state, trip: state.trip.filter((t) => t.destId !== action.destId) };

    case 'TOGGLE_ACTIVITY': {
      const exists = state.trip.some((t) => t.destId === action.destId);
      const trip = exists
        ? state.trip
        : [...state.trip, newItem(action.destId, nextStart(state.trip, action.fallbackStart))];
      return {
        ...state,
        trip: trip.map((t) => {
          if (t.destId !== action.destId) return t;
          const has = t.activities.includes(action.activityId);
          return {
            ...t,
            activities: has
              ? t.activities.filter((id) => id !== action.activityId)
              : [...t.activities, action.activityId],
          };
        }),
      };
    }

    case 'UPDATE_TRIP':
      return {
        ...state,
        trip: state.trip.map((t) => (t.destId === action.destId ? { ...t, ...action.changes } : t)),
      };

    case 'SET_BUDGET':
      return { ...state, budget: Math.max(0, Number(action.budget) || 0) };

    case 'CLEAR_TRIP':
      return { ...state, trip: [] };

    default:
      return state;
  }
}

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or blocked; the app still works in memory */
    }
  }, [state]);

  const summary = useMemo(() => computeSummary(state), [state]);
  const tripIds = useMemo(() => new Set(state.trip.map((t) => t.destId)), [state.trip]);

  const addDestination = useCallback(
    (destId) => dispatch({ type: 'ADD_DESTINATION', destId, fallbackStart: addDays(todayISO(), 30) }),
    [],
  );
  const removeDestination = useCallback((destId) => dispatch({ type: 'REMOVE_DESTINATION', destId }), []);
  const toggleActivity = useCallback(
    (destId, activityId) =>
      dispatch({ type: 'TOGGLE_ACTIVITY', destId, activityId, fallbackStart: addDays(todayISO(), 30) }),
    [],
  );
  const updateTrip = useCallback((destId, changes) => dispatch({ type: 'UPDATE_TRIP', destId, changes }), []);
  const setBudget = useCallback((budget) => dispatch({ type: 'SET_BUDGET', budget }), []);
  const clearTrip = useCallback(() => dispatch({ type: 'CLEAR_TRIP' }), []);

  const value = useMemo(
    () => ({
      trip: state.trip,
      budget: state.budget,
      summary,
      tripIds,
      addDestination,
      removeDestination,
      toggleActivity,
      updateTrip,
      setBudget,
      clearTrip,
    }),
    [state, summary, tripIds, addDestination, removeDestination, toggleActivity, updateTrip, setBudget, clearTrip],
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

TripProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrip must be used inside <TripProvider>');
  return ctx;
}
