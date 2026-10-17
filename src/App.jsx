import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Explore from './pages/Explore';
import MyTrips from './pages/MyTrips';
import Itinerary from './pages/Itinerary';
import Budget from './pages/Budget';
import EmptyState from './components/EmptyState';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Explore />} />
        <Route path="my-trips" element={<MyTrips />} />
        <Route path="itinerary" element={<Itinerary />} />
        <Route path="budget" element={<Budget />} />
        <Route
          path="*"
          element={
            <EmptyState icon="🧭" title="Page not found" message="That route does not exist." actionTo="/" actionLabel="Back to Explore" />
          }
        />
      </Route>
    </Routes>
  );
}
