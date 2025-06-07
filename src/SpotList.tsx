import React, { useState } from 'react';
import { mockSpots } from './spots';
import type { LocalSpot, SpotCategory } from './spots';
import { useAuth } from './auth';

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
  const [spots, setSpots] = useState<LocalSpot[]>(mockSpots);
  const [activity, setActivity] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [rating, setRating] = useState('');
  const [cost, setCost] = useState('');
  const [popularity, setPopularity] = useState('');
  const [riskReward, setRiskReward] = useState('');
  const { user } = useAuth();

  const unlockSpot = (id: string) => {
    setSpots(spots =>
      spots.map(spot =>
        spot.id === id ? { ...spot, isUnlocked: true, unlocks: spot.unlocks + 1 } : spot
      )
    );
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
    </section>
  );
};

export default SpotList;
