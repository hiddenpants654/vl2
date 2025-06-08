import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { mockSpots } from './spots';
import type { LocalSpot } from './spots';

// Custom pin icon for treasure theme
const treasureIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Helper to get lat/lng for demo (replace with real geocoding in production)
const cityCoords: Record<string, [number, number]> = {
  Riverbank: [37.736, -120.935],
  Mapleton: [39.548, -123.355],
  Seaside: [45.993, -123.922],
  Hilltown: [40.712, -74.006],
  Oldtown: [41.878, -87.629],
  'Palm City': [27.167, -80.266],
  'New Orleans': [29.951, -90.071],
  Laguna: [33.542, -117.785],
  Austin: [30.267, -97.743],
  Boulder: [40.015, -105.270],
};

const LandingMap: React.FC = () => (
  <div style={{ margin: '32px auto', maxWidth: 900 }}>
    <MapContainer
      center={[37.8, -96]}
      zoom={4}
      style={{ width: '100%', height: 500, borderRadius: 16 }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {mockSpots.map((spot: LocalSpot) => {
        const coords = cityCoords[spot.city];
        if (!coords) return null;
        return (
          <Marker key={spot.id} position={coords} icon={treasureIcon}>
            <Popup>
              <div style={{ width: 180 }}>
                <img src={spot.images[0]} alt={spot.title} style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 6, marginBottom: 4 }} />
                <b>{spot.title}</b>
                <br />{spot.city}, {spot.state}
                <br /><b>Price:</b> ${spot.price}
                <br /><b>Popularity:</b> {spot.popularity}
                <br /><b>Unlocks:</b> {spot.unlocks}
                <br /><span style={{ fontSize: 12 }}>{spot.isUnlocked ? spot.description : 'Unlock to see details.'}</span>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  </div>
);

export default LandingMap;
