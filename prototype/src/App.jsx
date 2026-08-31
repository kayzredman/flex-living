import { useState } from 'react';
import Home from './pages/Home';
import PropertyDetails from './pages/PropertyDetails';
import Booking from './pages/Booking';
import LandlordDashboard from './pages/LandlordDashboard';
import StayManagement from './pages/StayManagement';

const properties = [
  {
    id: 1,
    title: 'Luxury Cantonments Apartment',
    city: 'Accra, Ghana',
    price: 4000,
    currency: 'GHS',
    image: '/accra.jpg',
    scout: 'Ama (Flex Guide)',
    rating: 4.9,
    badges: ['POWER_247', 'INTERNET_100', 'SECURITY_FORTIFIED'],
    description: 'A stunning, modern luxury apartment in Cantonments. Verified by Ama on Aug 25, 2026. 24/7 Power, Ultra Fibre Internet, and Fortified Security confirmed.'
  },
  {
    id: 2,
    title: 'Sleek Lekki Studio',
    city: 'Lagos, Nigeria',
    price: 600000,
    currency: 'NGN',
    image: '/lagos.jpg',
    scout: 'Chinedu (Flex Guide)',
    rating: 4.7,
    badges: ['POWER_WORK_READY', 'INTERNET_30'],
    description: 'Minimalist studio in Lekki Phase 1. Verified inverter power and reliable 30Mbps internet for remote work.'
  },
  {
    id: 3,
    title: 'Spacious Kilimani Apartment',
    city: 'Nairobi, Kenya',
    price: 65000,
    currency: 'KES',
    image: '/nairobi.jpg',
    scout: 'Njeri (Flex Guide)',
    rating: 5.0,
    badges: ['POWER_247', 'INTERNET_100', 'SECURITY_FORTIFIED'],
    description: 'Beautiful, airy apartment in Kilimani with a large balcony. Fully verified for power, internet, and secure access.'
  }
];

function App() {
  const [persona, setPersona] = useState('TENANT'); // TENANT, LANDLORD
  const [currentScreen, setCurrentScreen] = useState('HOME'); // HOME, DETAILS, BOOKING, STAY
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currency, setCurrency] = useState('GHS'); // GHS, USD, NGN, KES
  const [searchQuery, setSearchQuery] = useState('');

  const navigateTo = (screen, property = null) => {
    if (property) setSelectedProperty(property);
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-container">
      {/* Universal Luxury Web Navbar */}
      <header className="web-navbar">
        <div className="nav-brand" onClick={() => navigateTo('HOME')}>
          <div className="nav-brand-logo">FL</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--teal)' }}>
              Flex-Living
            </div>
            <div className="text-secondary" style={{ fontSize: '0.75rem', marginTop: '-2px' }}>
              Verified Stays & SLA Guarantee
            </div>
          </div>
        </div>

        {/* Global Desktop Search with Live Input */}
        <div className="nav-search-bar">
          <span style={{ color: 'var(--text-secondary)' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Search Accra, Lagos, Nairobi (Solar, Starlink, Borehole)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.85rem' }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.9rem' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Controls: Currency Switcher, Persona Switcher & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Currency Switcher Pill */}
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '20px', padding: '2px', display: 'flex' }}>
            {['GHS', 'USD', 'NGN'].map(curr => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                style={{
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '16px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: currency === curr ? 'var(--teal)' : 'transparent',
                  color: currency === curr ? 'white' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                {curr}
              </button>
            ))}
          </div>

          <div className="nav-persona-pill">
            <button 
              className={`nav-persona-btn ${persona === 'TENANT' ? 'active-tenant' : ''}`}
              onClick={() => { setPersona('TENANT'); setCurrentScreen('HOME'); }}
            >
              Tenant Portal
            </button>
            <button 
              className={`nav-persona-btn ${persona === 'LANDLORD' ? 'active-landlord' : ''}`}
              onClick={() => setPersona('LANDLORD')}
            >
              Host Hub
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.35rem 0.75rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--gold)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.75rem' }}>
              ✓
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--teal)' }}>Tier 2 Verified</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {persona === 'LANDLORD' && <LandlordDashboard currency={currency} />}
        
        {persona === 'TENANT' && currentScreen === 'HOME' && (
          <Home 
            properties={properties} 
            searchQuery={searchQuery}
            currency={currency}
            onSelect={(p) => navigateTo('DETAILS', p)} 
          />
        )}
        
        {persona === 'TENANT' && currentScreen === 'DETAILS' && selectedProperty && (
          <PropertyDetails 
            property={selectedProperty} 
            currency={currency}
            onBack={() => navigateTo('HOME')} 
            onBook={() => navigateTo('BOOKING')} 
          />
        )}
        
        {persona === 'TENANT' && currentScreen === 'BOOKING' && selectedProperty && (
          <Booking 
            property={selectedProperty} 
            currency={currency}
            onBack={() => navigateTo('DETAILS')} 
            onComplete={() => navigateTo('STAY')} 
          />
        )}

        {persona === 'TENANT' && currentScreen === 'STAY' && selectedProperty && (
          <StayManagement
            property={selectedProperty}
            currency={currency}
            onBack={() => navigateTo('HOME')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
