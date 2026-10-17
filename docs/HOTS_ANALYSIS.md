# HOTS / Case Analysis

**Scenario:** a user removes an activity that appears in both the travel itinerary and the estimated budget. How does the application keep data consistent across components, and why were these state-management and component-design decisions made?

## 1. What happens in TripCraft

The user clicks the checkbox on the Itinerary page (or the ✕ next to the same activity in the Budget table). Either way the component calls the same function from context:

```js
toggleActivity(destId, activityId)
// -> dispatch({ type: 'TOGGLE_ACTIVITY', destId, activityId })
```

The reducer (`src/context/TripContext.jsx`) returns a new `trip` array in which only that destination's `activities` list loses the activity id. React then re-renders every component that consumes the context:

| Component | What it shows | What changes |
| --- | --- | --- |
| `Itinerary` / `ActivityItem` | checkbox state, stop total | box unticks, stop total drops |
| `Budget` itemised table | one row per chosen activity | row disappears, grand total drops |
| `Budget` bars + `BudgetRing` | activities share of spend, % of budget | bar shrinks, ring shortens |
| `TripSummaryCard` (Explore) | total cost | total drops |
| `TripCard` (My Trips) | activity count, trip cost | both drop |

All of these update in the same render pass. There is no code that "tells" the other views to update.

## 2. Key design decisions

### a) One source of truth
The only stored data is `{ trip: [{ destId, startDate, nights, activities: [ids] }], budget }`. An activity exists in exactly one place: the id inside its trip item. There is no second copy in a "budget" list, so the two views cannot drift apart.

### b) Derived data is computed, never stored
Costs, totals, percentage used and remaining budget come from `computeSummary(state)` (`src/utils/trip.js`), a pure function memoised with `useMemo` in the provider. Storing totals in state would create the classic bug where one value is updated and another is forgotten. Deriving them makes that bug impossible.

### c) `useReducer` + Context instead of prop drilling or per-page `useState`
- Four routed pages and several widgets need the same data. Passing it through props from `App` would mean threading it through `Layout`, `Outlet` and every page; and per-page `useState` would give each page its own copy.
- `useReducer` centralises every state transition (`ADD_DESTINATION`, `REMOVE_DESTINATION`, `TOGGLE_ACTIVITY`, `UPDATE_TRIP`, `SET_BUDGET`, `CLEAR_TRIP`) in one pure, testable function with predictable updates.
- Context is the right size for this app. An external store (Redux/Zustand) would add a dependency without solving a problem we have.

### d) Removing a destination cascades automatically
Because activities are nested inside their trip item, `REMOVE_DESTINATION` deletes the item and its activities together. The budget has nothing left to clean up, and no orphaned activity costs can remain.

### e) Presentational components stay dumb and reusable
`ActivityItem`, `DestinationCard`, `BudgetRing`, `TripCard` and `WeatherPanel` receive data and callbacks through validated props. They know nothing about the reducer. That is why `ActivityItem` is reused unchanged on the Explore detail panel and on the Itinerary page, and `BudgetRing` on both Explore and Budget.

### f) Stable callbacks and memoisation
Action creators are wrapped in `useCallback` and the context value in `useMemo`, so consumers re-render only when the data they depend on actually changes.

### g) Immutability
The reducer never mutates state; it returns new arrays and objects. React detects the change by reference and re-renders correctly, and StrictMode's double-invocation of reducers is harmless.

### h) Persistence
A `useEffect` writes state to `localStorage` after every change, so the plan survives a refresh and is still the single, consistent copy.

## 3. Alternatives considered

| Approach | Why it was rejected |
| --- | --- |
| Separate `itinerary` and `budget` arrays in state | Two copies of the same fact; every removal would have to update both, and forgetting one causes inconsistency. |
| Lifting state to `App` and passing props | Works, but needs deep prop drilling through the router outlet and makes pages hard to reuse. |
| Storing `total` in state | Redundant and stale-prone; deriving it is cheaper and always correct. |
| Redux / Zustand | Unnecessary complexity for a few dozen items of state. |

## 4. Conclusion

Consistency in TripCraft comes from architecture, not from synchronisation code: one reducer-managed source of truth, derived totals, and presentational components that simply render what they are given. Removing an activity is a single dispatch, and every view that shows that activity or its cost updates together.
