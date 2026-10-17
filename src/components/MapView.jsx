import { useEffect } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet';
import { destinationShape } from '../propTypes';

// Custom coloured pins (divIcon) avoid Leaflet's default-icon bundler problems.
const pinIcon = (color, selected, inTrip) =>
  L.divIcon({
    className: 'pin-wrapper',
    html: `<span class="map-pin${selected ? ' selected' : ''}${inTrip ? ' in-trip' : ''}" style="--pin:${color}"></span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    tooltipAnchor: [0, -26],
  });

function FlyToSelected({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 4), { duration: 0.8 });
  }, [target, map]);
  return null;
}

FlyToSelected.propTypes = {
  target: PropTypes.shape({ lat: PropTypes.number, lng: PropTypes.number }),
};

FlyToSelected.defaultProps = { target: null };

/** Interactive OpenStreetMap (Leaflet) showing every destination as a clickable pin. */
export default function MapView({ destinations, selectedId, tripIds, onSelect }) {
  const selected = destinations.find((d) => d.id === selectedId) ?? null;

  return (
    <div className="map-card">
      <MapContainer center={[22, 70]} zoom={2} minZoom={2} worldCopyJump scrollWheelZoom className="map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {destinations.map((d) => (
          <Marker
            key={d.id}
            position={[d.lat, d.lng]}
            icon={pinIcon(d.color, d.id === selectedId, tripIds.has(d.id))}
            eventHandlers={{ click: () => onSelect(d.id) }}
            zIndexOffset={d.id === selectedId ? 1000 : 0}
          >
            <Tooltip direction="top">
              {d.name}, {d.country}
            </Tooltip>
          </Marker>
        ))}
        <FlyToSelected target={selected} />
      </MapContainer>
    </div>
  );
}

MapView.propTypes = {
  destinations: PropTypes.arrayOf(destinationShape).isRequired,
  selectedId: PropTypes.string,
  tripIds: PropTypes.instanceOf(Set).isRequired,
  onSelect: PropTypes.func.isRequired,
};

MapView.defaultProps = {
  selectedId: null,
};
