import { getDestination } from '../data/destinations';
import { addDays } from './format';

/**
 * Pure function: derives every number the UI needs from the single source of truth
 * (`state.trip` + `state.budget`). Nothing here is stored, so the itinerary, the
 * budget page and the summary cards can never disagree with each other.
 */
export function computeSummary({ trip, budget }) {
  const lines = trip
    .map((item) => {
      const destination = getDestination(item.destId);
      if (!destination) return null;
      const activities = destination.activities.filter((a) => item.activities.includes(a.id));
      const flightCost = destination.flight;
      const stayCost = destination.perNight * item.nights;
      const activityCost = activities.reduce((sum, a) => sum + a.cost, 0);
      return {
        destId: item.destId,
        destination,
        startDate: item.startDate,
        endDate: addDays(item.startDate, item.nights),
        nights: item.nights,
        activities,
        flightCost,
        stayCost,
        activityCost,
        total: flightCost + stayCost + activityCost,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  const sum = (key) => lines.reduce((s, l) => s + l[key], 0);
  const total = sum('total');

  return {
    lines,
    flightTotal: sum('flightCost'),
    stayTotal: sum('stayCost'),
    activityTotal: sum('activityCost'),
    total,
    budget,
    remaining: budget - total,
    percentUsed: budget > 0 ? Math.round((total / budget) * 100) : 0,
    nights: sum('nights'),
    activityCount: lines.reduce((s, l) => s + l.activities.length, 0),
    overBudget: total > budget,
  };
}
