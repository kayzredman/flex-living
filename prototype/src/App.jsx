import { useState, useEffect } from 'react';
import Home from './pages/Home';
import PropertyDetails from './pages/PropertyDetails';
import Booking from './pages/Booking';
import LandlordDashboard from './pages/LandlordDashboard';
import StayManagement from './pages/StayManagement';
import ScoutPortal from './pages/ScoutPortal';
import AdminFlags from './pages/AdminFlags';

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
  const [persona, setPersona] = useState('TENANT'); // TENANT, LANDLORD, SCOUT, ADMIN
  const [currentScreen, setCurrentScreen] = useState('HOME'); // HOME, DETAILS, BOOKING, STAY
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currency, setCurrency] = useState('GHS'); // GHS, USD, NGN, KES
  const [searchQuery, setSearchQuery] = useState('');
  const [flags, setFlags] = useState({
    FLAG_VERIFIED_BADGES: true,
    FLAG_200_POINT_TELEMETRY: true,
    FLAG_CURRENCY_SWITCHER: true,
    FLAG_FLEX_ADVANCE_MONTHLY: true,
    FLAG_MOMO_USSD_PUSH: true,
    FLAG_HOST_ESCROW_VAULT: true,
    FLAG_SAVINGS_SIMULATOR: true,
    FLAG_SMILEID_BIOMETRICS: true,
    FLAG_PAYROLL_DEDUCTION: true,
    FLAG_DIGITAL_DOOR_UNLOCK: true,
    FLAG_TTLOCK_MASTER_PIN: true,
    FLAG_TTLOCK_GUEST_PASSES: true,
    FLAG_WHATSAPP_PIN_SHARE: true,
    FLAG_STARLINK_WIFI_CARD: true,
    FLAG_SLA_REPORT_OUTAGE: true,
    FLAG_SLA_2HR_CURE_TIMER: true,
    FLAG_SLA_MOMO_REFUND: true,
    FLAG_CARETAKER_WHATSAPP_BOT: true,
    FLAG_SCOUT_HEADER_MODE: true,
    FLAG_SCOUT_OFFLINE_MODE: true,
    FLAG_SCOUT_AI_VISION: true,
    FLAG_SCOUT_FLEET_GOVERNANCE: true,
    FLAG_HOST_LIST_PROPERTY: true,
    FLAG_AI_SURGE_PRICING: true,
    FLAG_GRA_TAX_REMITTANCE: true
  });

  // Fetch flags from Gateway
  useEffect(() => {
    const checkFlags = async () => {
      try {
        const res = await fetch('http://localhost:3004/v1/config/flags');
        if (res.ok) {
          const data = await res.json();
          if (data && data.flags) setFlags(data.flags);
        }
      } catch (e) {
        // Fallback silently
      }
    };
    checkFlags();
    const interval = setInterval(checkFlags, 2000);
    return () => clearInterval(interval);
  }, []);

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
          {/* Currency Switcher Pill (Controllable by FLAG_CURRENCY_SWITCHER) */}
          {flags.FLAG_CURRENCY_SWITCHER && (
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
          )}

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
            {flags.FLAG_SCOUT_HEADER_MODE && (
              <button 
                className={`nav-persona-btn ${persona === 'SCOUT' ? 'active-scout' : ''}`}
                onClick={() => setPersona('SCOUT')}
              >
                🧭 Scout Portal
              </button>
            )}
            <button 
              className={`nav-persona-btn ${persona === 'ADMIN' ? 'active-admin' : ''}`}
              onClick={() => setPersona('ADMIN')}
              style={{
                color: persona === 'ADMIN' ? 'white' : 'var(--coral)',
                background: persona === 'ADMIN' ? 'var(--coral)' : 'transparent',
                fontWeight: 800
              }}
            >
              🎛️ Feature Flags
            </button>
          </div>

          {/* Quick Direct Scout Operations Button */}
          {flags.FLAG_SCOUT_HEADER_MODE && (
            <button
              onClick={() => setPersona('SCOUT')}
              style={{
                background: persona === 'SCOUT' ? 'linear-gradient(135deg, var(--gold), var(--coral))' : '#0F2537',
                border: '1px solid var(--gold)',
                color: persona === 'SCOUT' ? '#0B1B26' : 'var(--gold-light)',
                padding: '0.4rem 0.9rem',
                borderRadius: '20px',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🧭</span> Scout Portal
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {persona === 'ADMIN' && <AdminFlags onBack={() => setPersona('TENANT')} />}
        {persona === 'SCOUT' && <ScoutPortal flags={flags} />}
        {persona === 'LANDLORD' && <LandlordDashboard currency={currency} flags={flags} />}
        
        {persona === 'TENANT' && currentScreen === 'HOME' && (
          <Home 
            properties={properties} 
            searchQuery={searchQuery}
            currency={currency}
            flags={flags}
            onSelect={(p) => navigateTo('DETAILS', p)} 
          />
        )}
        
        {persona === 'TENANT' && currentScreen === 'DETAILS' && selectedProperty && (
          <PropertyDetails 
            property={selectedProperty} 
            currency={currency}
            flags={flags}
            onBack={() => navigateTo('HOME')} 
            onBook={() => navigateTo('BOOKING')} 
          />
        )}
        
        {persona === 'TENANT' && currentScreen === 'BOOKING' && selectedProperty && (
          <Booking 
            property={selectedProperty} 
            currency={currency}
            flags={flags}
            onBack={() => navigateTo('DETAILS')} 
            onComplete={() => navigateTo('STAY')} 
          />
        )}

        {persona === 'TENANT' && currentScreen === 'STAY' && selectedProperty && (
          <StayManagement
            property={selectedProperty}
            currency={currency}
            flags={flags}
            onBack={() => navigateTo('HOME')}
          />
        )}
      </main>
    </div>
  );
}

export default App;

