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

  const navigateTo = (screen, property = null) => {
    if (property) setSelectedProperty(property);
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-container">
      {/* Persona Switcher (Fixed Bottom Nav) */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', display: 'flex', zIndex: 100 }}>
        <button 
          onClick={() => { setPersona('TENANT'); setCurrentScreen('HOME'); }}
          style={{ flex: 1, padding: '1rem', border: 'none', background: persona === 'TENANT' ? 'rgba(233,69,96,0.1)' : 'transparent', color: persona === 'TENANT' ? 'var(--coral)' : 'var(--text-secondary)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Tenant View
        </button>
        <button 
          onClick={() => setPersona('LANDLORD')}
          style={{ flex: 1, padding: '1rem', border: 'none', background: persona === 'LANDLORD' ? 'rgba(15,52,96,0.1)' : 'transparent', color: persona === 'LANDLORD' ? 'var(--teal)' : 'var(--text-secondary)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Host View
        </button>
      </div>

      {/* Routes */}
      <div style={{ paddingBottom: '70px' }}>
        {persona === 'LANDLORD' && <LandlordDashboard />}
        
        {persona === 'TENANT' && currentScreen === 'HOME' && (
          <Home properties={properties} onSelect={(p) => navigateTo('DETAILS', p)} />
        )}
        
        {persona === 'TENANT' && currentScreen === 'DETAILS' && selectedProperty && (
          <PropertyDetails 
            property={selectedProperty} 
            onBack={() => navigateTo('HOME')} 
            onBook={() => navigateTo('BOOKING')} 
          />
        )}
        
        {persona === 'TENANT' && currentScreen === 'BOOKING' && selectedProperty && (
          <Booking 
            property={selectedProperty} 
            onBack={() => navigateTo('DETAILS')} 
            onComplete={() => navigateTo('STAY')} 
          />
        )}

        {persona === 'TENANT' && currentScreen === 'STAY' && selectedProperty && (
          <StayManagement
            property={selectedProperty}
            onBack={() => navigateTo('HOME')}
          />
        )}
      </div>
    </div>
  );
}

export default App;
