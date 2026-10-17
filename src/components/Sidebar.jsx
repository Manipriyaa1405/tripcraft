import { NavLink } from 'react-router-dom';
import { useTrip } from '../context/TripContext';

const LINKS = [
  { to: '/', label: 'Explore', icon: '🧭', end: true },
  { to: '/my-trips', label: 'My Trips', icon: '🧳' },
  { to: '/itinerary', label: 'Itinerary', icon: '🗺️' },
  { to: '/budget', label: 'Budget', icon: '💰' },
];

export default function Sidebar() {
  const { tripIds } = useTrip();

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-icon" aria-hidden="true">✈️</span>
        <span className="brand-name">TripCraft</span>
      </div>

      <nav className="nav" aria-label="Main">
        {LINKS.map(({ to, label, icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span className="nav-icon" aria-hidden="true">{icon}</span>
            <span className="nav-label">{label}</span>
            {label === 'My Trips' && tripIds.size > 0 && <span className="nav-badge">{tripIds.size}</span>}
          </NavLink>
        ))}
      </nav>

      <p className="sidebar-tag">Discover. Plan. Travel.</p>
    </aside>
  );
}
