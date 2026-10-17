import { useMemo, useState } from 'react';
import { CATEGORIES, DESTINATIONS, startingCost } from '../data/destinations';
import { useTrip } from '../context/TripContext';
import useDebounce from '../hooks/useDebounce';
import PageHeader from '../components/PageHeader';
import CategoryChips from '../components/CategoryChips';
import DestinationCard from '../components/DestinationCard';
import DestinationDetail from '../components/DestinationDetail';
import MapView from '../components/MapView';
import TripSummaryCard from '../components/TripSummaryCard';

const SORTERS = {
  featured: () => 0,
  'price-asc': (a, b) => startingCost(a) - startingCost(b),
  'price-desc': (a, b) => startingCost(b) - startingCost(a),
  name: (a, b) => a.name.localeCompare(b.name),
};

export default function Explore() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const [selectedId, setSelectedId] = useState(DESTINATIONS[0].id);

  const { tripIds, addDestination, removeDestination } = useTrip();
  const debouncedQuery = useDebounce(query, 200);

  const results = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return DESTINATIONS.filter((d) => category === 'All' || d.category === category)
      .filter((d) => !q || `${d.name} ${d.country} ${d.category}`.toLowerCase().includes(q))
      .sort(SORTERS[sort]);
  }, [debouncedQuery, category, sort]);

  const selected = DESTINATIONS.find((d) => d.id === selectedId) ?? null;

  const toggleTrip = (id) => (tripIds.has(id) ? removeDestination(id) : addDestination(id));

  return (
    <>
      <PageHeader
        title="Explore Dream"
        accent="Destinations"
        subtitle="Plan your trip, discover new places and create unforgettable memories ✨"
      >
        <input
          type="search"
          className="search"
          placeholder="Search destinations or countries…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search destinations"
        />
      </PageHeader>

      <div className="toolbar">
        <CategoryChips categories={CATEGORIES} active={category} onChange={setCategory} />
        <label className="sort">
          <span className="muted small">Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name A-Z</option>
          </select>
        </label>
      </div>

      <div className="explore-grid">
        <div className="col-list">
          {results.length === 0 ? (
            <p className="muted card">No destinations match “{debouncedQuery}”. Try another search or filter.</p>
          ) : (
            results.map((d) => (
              <DestinationCard
                key={d.id}
                destination={d}
                selected={d.id === selectedId}
                inTrip={tripIds.has(d.id)}
                onSelect={setSelectedId}
                onToggleTrip={toggleTrip}
              />
            ))
          )}
        </div>

        <div className="col-main">
          <MapView
            destinations={results.length ? results : DESTINATIONS}
            selectedId={selectedId}
            tripIds={tripIds}
            onSelect={setSelectedId}
          />
          {selected && <DestinationDetail destination={selected} />}
        </div>

        <div className="col-side">
          <TripSummaryCard />
        </div>
      </div>
    </>
  );
}
