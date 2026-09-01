import { useState, useEffect } from 'react';
import Home from './pages/Home';
import PropertyDetails from './pages/PropertyDetails';
import Booking from './pages/Booking';
import LandlordDashboard from './pages/LandlordDashboard';
import StayManagement from './pages/StayManagement';
import ScoutPortal from './pages/ScoutPortal';
import AdminFlags from './pages/AdminFlags';
import UIUXShowcase from './pages/UIUXShowcase';
import FigmaStudio from './pages/FigmaStudio';

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
  const USERS = {
    TENANT: {
      id: 'usr_tenant_01',
      name: 'Kofi Mensah',
      email: 'kofi.mensah@gmail.com',
      badge: 'Diaspora Tenant',
      roleLabel: 'Tenant (Normal User)',
      avatar: 'KM',
      description: 'Browsing verified stays in Cantonments & Kilimani. Flex-Advance monthly rent active.'
    },
    LANDLORD: {
      id: 'usr_host_01',
      name: 'Kwame Osei',
      email: 'kwame.osei@oseiholdings.com',
      badge: 'Superhost (3 Stays)',
      roleLabel: 'Verified Landlord',
      avatar: 'KO',
      description: 'Managing Cantonments & Airport Residential portfolio. Detty Dec surge yield active.'
    },
    SCOUT: {
      id: 'usr_scout_01',
      name: 'Ama Mensah',
      email: 'ama.scout@flexliving.africa',
      badge: 'Certified Gold Inspector',
      roleLabel: 'Lead Field Scout',
      avatar: 'AM',
      description: 'Accra lead inspector. 200-point audits, acoustic testing, and AI vision scanner.'
    },
    ADMIN: {
      id: 'usr_admin_01',
      name: 'Akua Serwaa',
      email: 'akua.serwaa@flexliving.africa',
      badge: 'Platform Executive',
      roleLabel: 'Super Admin / Ops',
      avatar: 'AS',
      description: 'Full system control: Feature flag switchboard, scout fleet governance, and escrow vault.'
    }
  };

  const [persona, setPersona] = useState('TENANT'); // TENANT, LANDLORD, SCOUT, ADMIN
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
    const interval = setInterval(checkFlags, 2500);
    return () => clearInterval(interval);
  }, []);

  const navigateTo = (screen, property = null) => {
    if (property) setSelectedProperty(property);
    else if (screen === 'STAY' && !selectedProperty) setSelectedProperty(properties[0]);
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const currentUser = USERS[persona];

  return (
    <div className="app-container" onClick={() => isUserMenuOpen && setIsUserMenuOpen(false)}>
      {/* Universal Luxury Web Navbar */}
      <header className="web-navbar" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        {/* Brand Logo & Tagline */}
        <div className="nav-brand" onClick={() => { setPersona('TENANT'); navigateTo('HOME'); }} style={{ cursor: 'pointer' }}>
          <div className="nav-brand-logo">FL</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Flex-Living
              {persona === 'ADMIN' && (
                <span style={{ fontSize: '0.65rem', background: 'rgba(233,69,96,0.15)', color: '#E94560', border: '1px solid #E94560', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                  ADMIN OPS
                </span>
              )}
            </div>
            <div className="text-secondary" style={{ fontSize: '0.75rem', marginTop: '-2px' }}>
              Verified Stays & SLA Guarantee
            </div>
          </div>
        </div>

        {/* Global Desktop Search - Displayed for Tenants and Admins */}
        {(persona === 'TENANT' || persona === 'ADMIN') && (
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
        )}

        {/* Role-Tailored Primary Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Normal User (Tenant) Navigation */}
          {persona === 'TENANT' && (
            <div style={{ display: 'flex', gap: '0.4rem', background: '#F1F5F9', padding: '3px', borderRadius: '20px' }}>
              <button
                onClick={() => navigateTo('HOME')}
                style={{
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '16px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: currentScreen !== 'STAY' ? 'var(--teal)' : 'transparent',
                  color: currentScreen !== 'STAY' ? '#FFFFFF' : '#475569',
                  transition: 'all 0.2s ease'
                }}
              >
                Explore Stays
              </button>
              <button
                onClick={() => navigateTo('STAY', properties[0])}
                style={{
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '16px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: currentScreen === 'STAY' ? 'var(--teal)' : 'transparent',
                  color: currentScreen === 'STAY' ? '#FFFFFF' : '#475569',
                  transition: 'all 0.2s ease'
                }}
              >
                🔐 My Stay & Key
              </button>
            </div>
          )}

          {/* Host Navigation */}
          {persona === 'LANDLORD' && (
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--teal)', background: 'rgba(15,52,96,0.08)', padding: '5px 12px', borderRadius: '16px' }}>
                🏡 Landlord Hub Active
              </span>
            </div>
          )}

          {/* Scout Navigation */}
          {persona === 'SCOUT' && (
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#D97706', background: 'rgba(217,119,6,0.1)', padding: '5px 12px', borderRadius: '16px' }}>
                🧭 Field Scout Operations Active
              </span>
            </div>
          )}

          {/* Admin Navigation */}
          {persona === 'ADMIN' && (
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#E94560', background: 'rgba(233,69,96,0.1)', padding: '5px 12px', borderRadius: '16px' }}>
                ⚡ Admin Mission Control Active
              </span>
            </div>
          )}

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

          {/* Prototype Preview Button */}
          <button
            onClick={() => navigateTo('PROTOTYPE_PREVIEW')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: currentScreen === 'PROTOTYPE_PREVIEW' ? 'linear-gradient(135deg, #0B1B26, #1E293B)' : 'rgba(233,163,25,0.12)',
              border: '1.5px solid #E9A319',
              color: currentScreen === 'PROTOTYPE_PREVIEW' ? '#E9A319' : '#B45309',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(233,163,25,0.15)',
              transition: 'all 0.2s ease'
            }}
          >
            <span>✨</span> Pro Max Prototype
          </button>

          {/* Figma Design Studio Button */}
          <button
            onClick={() => navigateTo('FIGMA_STUDIO')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: currentScreen === 'FIGMA_STUDIO' ? '#0C8CE9' : '#2C2C2C',
              border: '1.5px solid #0C8CE9',
              color: '#FFFFFF',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(12,140,233,0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            <span>🎨</span> Figma Canvas
          </button>

          {/* Persona Switcher & Authenticated Profile Pill */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsUserMenuOpen(!isUserMenuOpen);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: persona === 'ADMIN' ? 'linear-gradient(135deg, #0B1B26, #1E293B)' : '#FFFFFF',
                border: persona === 'ADMIN' ? '1.5px solid #E9A319' : '1px solid var(--border)',
                borderRadius: '24px',
                padding: '4px 12px 4px 6px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '14px',
                background: persona === 'ADMIN' ? '#E9A319' : persona === 'SCOUT' ? '#D97706' : persona === 'LANDLORD' ? '#0F3460' : 'var(--teal)',
                color: '#FFFFFF',
                fontSize: '0.75rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {currentUser.avatar}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: persona === 'ADMIN' ? '#FFFFFF' : 'var(--teal)', lineHeight: 1.1 }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '0.65rem', color: persona === 'ADMIN' ? '#E9A319' : 'var(--text-secondary)' }}>
                  {currentUser.roleLabel}
                </div>
              </div>
              <span style={{ fontSize: '0.7rem', color: persona === 'ADMIN' ? '#E9A319' : 'var(--text-secondary)', marginLeft: '2px' }}>
                ▾
              </span>
            </button>

            {/* Persona Switcher Dropdown Modal Card */}
            {isUserMenuOpen && (
              <div 
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  width: '320px',
                  background: '#FFFFFF',
                  borderRadius: '18px',
                  boxShadow: '0 15px 35px -5px rgba(11,27,38,0.25), 0 0 0 1px rgba(11,27,38,0.08)',
                  padding: '16px',
                  zIndex: 200,
                  animation: 'fadeIn 0.2s ease-out'
                }}
              >
                {/* Active Account Info Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9', marginBottom: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '19px',
                    background: persona === 'ADMIN' ? '#E9A319' : persona === 'SCOUT' ? '#D97706' : persona === 'LANDLORD' ? '#0F3460' : 'var(--teal)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {currentUser.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--teal)' }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {currentUser.email}
                    </div>
                    <span style={{ fontSize: '0.65rem', background: '#ECFDF5', color: '#059669', padding: '1px 6px', borderRadius: '8px', fontWeight: 800, display: 'inline-block', marginTop: '2px' }}>
                      ✓ {currentUser.badge}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                  Switch Role / Persona
                </div>

                {/* Persona Option 1: Normal Tenant */}
                <div 
                  onClick={() => {
                    setPersona('TENANT');
                    setCurrentScreen('HOME');
                    setIsUserMenuOpen(false);
                  }}
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    marginBottom: '6px',
                    cursor: 'pointer',
                    background: persona === 'TENANT' ? 'rgba(15,52,96,0.06)' : 'transparent',
                    border: persona === 'TENANT' ? '1px solid var(--teal)' : '1px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--teal)' }}>
                      👤 Tenant (Normal Consumer View)
                    </div>
                    {persona === 'TENANT' && (
                      <span style={{ fontSize: '0.65rem', background: 'var(--teal)', color: 'white', padding: '2px 6px', borderRadius: '8px', fontWeight: 800 }}>ACTIVE</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '2px' }}>
                    Explore vetted homes, Flex-Advance rent financing, and digital door unlock.
                  </div>
                </div>

                {/* Persona Option 2: Host / Landlord */}
                <div 
                  onClick={() => {
                    setPersona('LANDLORD');
                    setIsUserMenuOpen(false);
                  }}
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    marginBottom: '6px',
                    cursor: 'pointer',
                    background: persona === 'LANDLORD' ? 'rgba(15,52,96,0.06)' : 'transparent',
                    border: persona === 'LANDLORD' ? '1px solid var(--teal)' : '1px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--teal)' }}>
                      🏡 Landlord / Host
                    </div>
                    {persona === 'LANDLORD' && (
                      <span style={{ fontSize: '0.65rem', background: 'var(--teal)', color: 'white', padding: '2px 6px', borderRadius: '8px', fontWeight: 800 }}>ACTIVE</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '2px' }}>
                    Portfolio performance, dynamic yield & "Detty Dec" surge calendar.
                  </div>
                </div>

                {/* Persona Option 3: Field Scout */}
                <div 
                  onClick={() => {
                    setPersona('SCOUT');
                    setIsUserMenuOpen(false);
                  }}
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    marginBottom: '6px',
                    cursor: 'pointer',
                    background: persona === 'SCOUT' ? 'rgba(217,119,6,0.08)' : 'transparent',
                    border: persona === 'SCOUT' ? '1px solid #D97706' : '1px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#D97706' }}>
                      🧭 Field Scout (Inspector)
                    </div>
                    {persona === 'SCOUT' && (
                      <span style={{ fontSize: '0.65rem', background: '#D97706', color: 'white', padding: '2px 6px', borderRadius: '8px', fontWeight: 800 }}>ACTIVE</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '2px' }}>
                    200-point audit workbench, AI vision scanner, and bounty wallet cashout.
                  </div>
                </div>

                {/* Persona Option 4: Platform Admin */}
                <div 
                  onClick={() => {
                    setPersona('ADMIN');
                    setIsUserMenuOpen(false);
                  }}
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: persona === 'ADMIN' ? 'rgba(233,69,96,0.08)' : 'transparent',
                    border: persona === 'ADMIN' ? '1px solid #E94560' : '1px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#E94560' }}>
                      ⚡ Platform Admin / Executive
                    </div>
                    {persona === 'ADMIN' && (
                      <span style={{ fontSize: '0.65rem', background: '#E94560', color: 'white', padding: '2px 6px', borderRadius: '8px', fontWeight: 800 }}>ACTIVE</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '2px' }}>
                    Feature flag switchboard, scout fleet governance, and escrow vault ledger.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {currentScreen === 'FIGMA_STUDIO' && (
          <FigmaStudio onBack={() => navigateTo('HOME')} />
        )}

        {currentScreen === 'PROTOTYPE_PREVIEW' && (
          <UIUXShowcase onBack={() => navigateTo('HOME')} />
        )}

        {currentScreen !== 'PROTOTYPE_PREVIEW' && currentScreen !== 'FIGMA_STUDIO' && persona === 'ADMIN' && <AdminFlags onBack={() => setPersona('TENANT')} />}
        {currentScreen !== 'PROTOTYPE_PREVIEW' && currentScreen !== 'FIGMA_STUDIO' && persona === 'SCOUT' && <ScoutPortal flags={flags} />}
        {currentScreen !== 'PROTOTYPE_PREVIEW' && currentScreen !== 'FIGMA_STUDIO' && persona === 'LANDLORD' && <LandlordDashboard currency={currency} flags={flags} />}
        
        {currentScreen !== 'PROTOTYPE_PREVIEW' && currentScreen !== 'FIGMA_STUDIO' && persona === 'TENANT' && currentScreen === 'HOME' && (
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

