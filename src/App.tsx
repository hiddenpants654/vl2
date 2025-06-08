import { AuthProvider, AuthUI } from './auth';
import SpotList from './SpotList';
import React, { useState } from 'react';
import './App.css'
import LandingMap from './LandingMap';

// Navigation component
const Nav: React.FC<{ page: string; setPage: (p: string) => void }> = ({ page, setPage }) => (
  <nav style={{ display: 'flex', gap: 24, marginBottom: 32, alignItems: 'center' }}>
    <button onClick={() => setPage('home')} style={{ fontWeight: page === 'home' ? 'bold' : undefined }}>Home</button>
    <button onClick={() => setPage('spots')} style={{ fontWeight: page === 'spots' ? 'bold' : undefined }}>Spots</button>
    <button onClick={() => setPage('account')} style={{ fontWeight: page === 'account' ? 'bold' : undefined }}>Account</button>
    <button onClick={() => setPage('become-local')} style={{ fontWeight: page === 'become-local' ? 'bold' : undefined }}>Become a Local</button>
  </nav>
);

// Landing page
const Landing: React.FC = () => (
  <section style={{ textAlign: 'center', marginBottom: 32 }}>
    <h1 style={{ fontSize: 40, marginBottom: 8 }}>Discover Hidden Local Treasures</h1>
    <p style={{ fontSize: 20, maxWidth: 600, margin: '0 auto' }}>
      Our mission: Connect travelers and locals by sharing authentic, off-the-map spots. No tourist traps, just real recommendations from real locals. Unlock unique places to eat, explore, and experience—directly from those who know best.
    </p>
    <LandingMap />
  </section>
);

// Placeholder for map
const MapSection: React.FC = () => (
  <section style={{ margin: '32px 0', textAlign: 'center' }}>
    <h2>Map of Local Spot Areas</h2>
    <div style={{ width: '100%', maxWidth: 700, height: 320, margin: '0 auto', background: '#23231a', border: '2px dashed #b8860b', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffd700', fontSize: 24 }}>
      [Map Placeholder: General areas of local spots by city]
    </div>
  </section>
);

// Account/Profile page
const Account: React.FC = () => (
  <section>
    <h2>My Account</h2>
    <p>View and manage your account details here.</p>
    {/* Add more account management features here */}
  </section>
);

// Become a Local/Profile page
const BecomeLocal: React.FC = () => (
  <section>
    <h2>Become a Local</h2>
    <p>Apply to become a verified local and start earning by sharing your favorite spots!</p>
    {/* Add local verification/subscription logic here */}
  </section>
);

function App() {
  const [page, setPage] = useState('home')

  return (
    <AuthProvider>
      <>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
        <Nav page={page} setPage={setPage} />
        <AuthUI />
        {page === 'home' && <><Landing /><MapSection /></>}
        {page === 'spots' && <SpotList />}
        {page === 'account' && <Account />}
        {page === 'become-local' && <BecomeLocal />}
      </main>
      </>
    </AuthProvider>
  )
}

export default App
