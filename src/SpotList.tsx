import React, { useState, useEffect } from 'react';
import { mockSpots, fetchSpots } from './spots';
import type { LocalSpot, SpotCategory } from './spots';
import { useAuth } from './auth';

// You can use leaflet or google-maps-react for a real map. Here is a simple placeholder map using leaflet.
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Dummy coordinates for demonstration (replace with real lat/lng in your spot data)
const cityCoords: Record<string, [number, number]> = {
  Riverbank: [37.736, -120.935],
  Mapleton: [37.5, -121.0],
  Seaside: [45.993, -123.922],
  Hilltown: [40.7128, -74.006],
  Oldtown: [41.8781, -87.6298],
  'Palm City': [27.167, -80.266],
  'New Orleans': [29.9511, -90.0715],
  Laguna: [33.5427, -117.7854],
  Austin: [30.2672, -97.7431],
  Boulder: [40.015, -105.2705],
};

const activities: SpotCategory[] = [
  'places-to-eat',
  'outdoor',
  'exercising',
  'fishing-hunting',
  'entertainment-nightlife',
  'adventurous',
  'romantic',
  'hidden-gem',
];

const states = Array.from(new Set(mockSpots.map(s => s.state)));
const cities = Array.from(new Set(mockSpots.map(s => s.city)));

const SpotList: React.FC = () => {
  const [selectedSpot, setSelectedSpot] = useState<LocalSpot | null>(null);
  const [activity, setActivity] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [rating, setRating] = useState('');
  const [cost, setCost] = useState('');
  const [popularity, setPopularity] = useState('');
  const [riskReward, setRiskReward] = useState('');
  const [spots, setSpots] = useState<LocalSpot[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchSpots().then((data) => setSpots(data as LocalSpot[]));
  }, []);

  const unlockSpot = (id: string) => {
    // Simulate unlock (in real app, handle payment)
    mockSpots.forEach(spot => {
      if (spot.id === id) {
        spot.isUnlocked = true;
        spot.unlocks += 1;
      }
    });
    alert('Spot unlocked! (Payment simulated)');
  };

  // Filter logic
  const filtered = spots.filter(spot =>
    (!activity || spot.category === activity) &&
    (!state || spot.state === state) &&
    (!city || spot.city === city) &&
    (!rating || (spot.rating ?? 0) >= Number(rating)) &&
    (!cost || spot.price <= Number(cost)) &&
    (!popularity || spot.popularity >= Number(popularity)) &&
    (!riskReward || spot.riskReward >= Number(riskReward))
  );

  return (
    <section>
      <h2>Available Local Spots</h2>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        <select value={activity} onChange={e => setActivity(e.target.value)}>
          <option value="">All Activities</option>
          {activities.map(a => <option key={a} value={a}>{a.replace(/-/g, ' ')}</option>)}
        </select>
        <select value={state} onChange={e => setState(e.target.value)}>
          <option value="">All States</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={city} onChange={e => setCity(e.target.value)}>
          <option value="">All Cities</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          type="number"
          placeholder="Max Cost"
          value={cost}
          min={0}
          onChange={e => setCost(e.target.value)}
          style={{ width: 90 }}
        />
        <input
          type="number"
          placeholder="Min Rating"
          value={rating}
          min={1}
          max={5}
          onChange={e => setRating(e.target.value)}
          style={{ width: 90 }}
        />
        <input
          type="number"
          placeholder="Min Popularity"
          value={popularity}
          min={0}
          onChange={e => setPopularity(e.target.value)}
          style={{ width: 90 }}
        />
        <input
          type="number"
          placeholder="Min Risk/Reward"
          value={riskReward}
          min={1}
          max={5}
          onChange={e => setRiskReward(e.target.value)}
          style={{ width: 90 }}
        />
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filtered.map(spot => (
          <li key={spot.id} className="treasure-card">
            <div className="treasure-pin" title="Map Pin" />
            <div style={{ display: 'flex', gap: 16 }}>
              <img src={spot.images[0]} alt={spot.title} style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 8, border: '2px solid #b8860b', background: '#222' }} />
              <div style={{ flex: 1 }}>
                <h3>{spot.title} <span style={{ fontSize: 14, color: '#888' }}>({spot.category.replace(/-/g, ' ')})</span></h3>
                <p>{spot.isUnlocked ? spot.description : 'Unlock to see details.'}</p>
                <p><b>Location:</b> {spot.isUnlocked ? `${spot.city}, ${spot.state}` : 'Unlock to see location.'}</p>
                <p><b>Price:</b> ${spot.price}</p>
                <p><b>Risk/Reward:</b> {spot.riskReward} / 5</p>
                <p><b>Popularity:</b> {spot.popularity}</p>
                <p><b>Unlocks:</b> {spot.unlocks}</p>
                <p><b>Rating:</b> {spot.rating ?? 'N/A'}</p>
                {!spot.isUnlocked && user?.role === 'buyer' && (
                  <button className="sparkle" onClick={() => unlockSpot(spot.id)}>
                    Unlock Spot
                  </button>
                )}
                {spot.isUnlocked && <span style={{ color: 'gold' }}>Unlocked</span>}
              </div>
            </div>
          </li>
        ))}
      </ul>
        <MapContainer
          center={[39.5, -98.35] as LatLngExpression} // Center of US
          zoom={4}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
        
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {spots.map(spot => {
            const coords = cityCoords[spot.city];
            if (!coords) return null;
            return (
              <Marker
                key={spot.id}
                position={coords}
                eventHandlers={{
                  click: () => setSelectedSpot(spot),
                }}
              />
            );
          })}
          {selectedSpot && (
            <Popup
              position={cityCoords[selectedSpot.city]}
              eventHandlers={{
                popupclose: () => setSelectedSpot(null),
              }}
            >
              <div style={{ minWidth: 180 }}>
                <img
                  src={selectedSpot.images[0]}
                  alt={selectedSpot.title}
                  style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }}
                />
                <h3 style={{ margin: 0 }}>{selectedSpot.title}</h3>
                <p style={{ margin: '4px 0' }}>
                  <b>Category:</b> {selectedSpot.category.replace(/-/g, ' ')}
                </p>
                <p style={{ margin: '4px 0' }}>
                  <b>Location:</b> {selectedSpot.city}, {selectedSpot.state}
                </p>
                <p style={{ margin: '4px 0' }}>
                  <b>Price:</b> ${selectedSpot.price}
                </p>
                <p style={{ margin: '4px 0' }}>
                  {selectedSpot.isUnlocked
                    ? selectedSpot.description
                    : <i>Unlock to see details.</i>}
                </p>
                {!selectedSpot.isUnlocked && user?.role === 'buyer' && (
                  <button
                    style={{
                      background: 'goldenrod',
                      color: '#222',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                    onClick={() => {
                      unlockSpot(selectedSpot.id);
                    }}
                  >
                    Unlock Spot
                  </button>
                )}
                {selectedSpot.isUnlocked && (
                  <span style={{ color: 'goldenrod', fontWeight: 600 }}>Unlocked</span>
                )}
              </div>
            </Popup>
          )}
        </MapContainer>
    </section>
  );
};

export default SpotList;
