# TripCraft - Smart Travel Planner & Experience Explorer

A responsive ReactJS single page application for exploring destinations, building an itinerary and tracking the estimated trip budget.
Built for BCSE203E Web Programming, Digital Assignment X.

## Features

- **Explore**: search (debounced), category chips, sorting, interactive map, destination detail with live weather and activities
- **My Trips**: overview cards and totals for every destination in the plan
- **Itinerary**: date-ordered timeline, editable start date and nights, activity checklist per stop
- **Budget**: editable budget, donut chart, flights / stay / activities breakdown, itemised table, over-budget warning
- Itinerary and budget are always in sync because both are derived from one state object
- Plan is saved in `localStorage` so it survives a refresh

## Tech

| Concern | Choice |
| --- | --- |
| Framework | React 18 + Vite |
| Routing | React Router v6 (`/`, `/my-trips`, `/itinerary`, `/budget`) |
| State | `useReducer` + Context (`src/context/TripContext.jsx`) |
| Hooks used | `useState`, `useReducer`, `useContext`, `useEffect`, `useMemo`, `useCallback`, `useRef`, custom `useDebounce`, `useWeather` |
| Prop validation | `prop-types` on every reusable component (shared shapes in `src/propTypes.js`) |
| Third-party APIs | **Open-Meteo** (live weather, no key needed) and **OpenStreetMap + Leaflet** (interactive map tiles, no key needed) |

No API keys are used, so there are no secrets in the public source. If you later add a keyed service, put the key in a `.env` file (ignored by git) and read it with `import.meta.env.VITE_YOUR_KEY`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview
```

## Project structure

```
src/
├── main.jsx                 entry: BrowserRouter + TripProvider
├── App.jsx                  route table
├── styles.css               responsive styling
├── propTypes.js             shared PropTypes shapes
├── data/destinations.js     destination + activity catalogue
├── context/TripContext.jsx  reducer, provider, useTrip()
├── utils/                   format.js (INR/dates), trip.js (computeSummary)
├── hooks/                   useDebounce.js, useWeather.js
├── components/
│   ├── Layout.jsx  Sidebar.jsx  PageHeader.jsx  EmptyState.jsx
│   ├── CategoryChips.jsx  DestinationCard.jsx  DestinationDetail.jsx
│   ├── ActivityItem.jsx  WeatherPanel.jsx  MapView.jsx
│   ├── TripSummaryCard.jsx  TripCard.jsx  BudgetRing.jsx
└── pages/                   Explore.jsx  MyTrips.jsx  Itinerary.jsx  Budget.jsx
```

## Component hierarchy

```
main.jsx
└─ BrowserRouter
   └─ TripProvider            (single source of truth: trip[] + budget)
      └─ App (Routes)
         └─ Layout
            ├─ Sidebar (NavLink x4, trip-count badge)
            └─ <Outlet/>
               ├─ Explore
               │   ├─ PageHeader + search input
               │   ├─ CategoryChips
               │   ├─ DestinationCard (xN)
               │   ├─ MapView
               │   ├─ DestinationDetail
               │   │   ├─ WeatherPanel (full)
               │   │   └─ ActivityItem (xN)
               │   └─ TripSummaryCard → BudgetRing
               ├─ MyTrips → TripCard (xN)
               ├─ Itinerary → ItineraryStop (xN) → WeatherPanel (compact), ActivityItem (xN)
               └─ Budget → BudgetRing, BreakdownBar (x3), FragmentRows (xN)
```

## Deploy (free)

**Vercel**: push to a public GitHub repo → vercel.com → *Add New Project* → import → Deploy (framework auto-detected as Vite). `vercel.json` already rewrites all routes to `index.html` so refreshing `/budget` works.

**Netlify**: same flow; build command `npm run build`, publish directory `dist`. `public/_redirects` handles the SPA fallback.

---

See `docs/HOTS_ANALYSIS.md` for the case analysis write-up.
