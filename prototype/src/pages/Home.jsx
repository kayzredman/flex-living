import React, { useState } from 'react';

const Badge = ({ type }) => {
  const config = {
    'POWER_247': { class: 'badge-power', label: '⚡ 24/7 Power' },
    'POWER_WORK_READY': { class: 'badge-power', label: '⚡ Work Ready' },
    'INTERNET_100': { class: 'badge-internet', label: '🌐 100Mbps' },
    'INTERNET_30': { class: 'badge-internet', label: '🌐 30Mbps' },
    'SECURITY_FORTIFIED': { class: 'badge-security', label: '🛡️ Secure' },
  };
  const badgeConfig = config[type];
  if (!badgeConfig) return null;

  return (
    <span className={`badge ${badgeConfig.class}`}>
      {badgeConfig.label}
    </span>
  );
};

export default function Home({ properties, onSelect }) {
  const [activeFilter, setActiveFilter] = useState('All');
  
  return (
    <div className="screen-container">
      <div className="d-flex justify-between align-center mb-4">
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Flex-Living</h1>
          <p className="text-secondary text-sm">Verified. Flexible. Fair.</p>
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--coral)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
          AK
        </div>
      </div>

      <div className="glass mb-4" style={{ borderRadius: '12px', padding: '1rem', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
        {['All', '⚡ Power 24/7', '🌐 Ultra Fibre', '🛡️ Security'].map(filter => (
          <button 
            key={filter}
            className={`btn ${activeFilter === filter ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', whiteSpace: 'nowrap', borderRadius: '20px' }}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Verified Listings</h2>
        {properties.map(property => (
          <div key={property.id} className="property-card" onClick={() => onSelect(property)}>
            <div className="property-card-image">
              <img src={property.image} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <span className="badge badge-verified">✓ Flex-Verified</span>
              </div>
            </div>
            <div className="property-card-content">
              <div className="d-flex justify-between align-center mb-2">
                <span className="text-secondary text-sm">{property.city}</span>
                <span className="text-sm font-bold" style={{ color: 'var(--gold)' }}>⭐ {property.rating}</span>
              </div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{property.title}</h3>
              <div className="property-price mb-2">
                {property.currency} {property.price.toLocaleString()} <span>/ month</span>
              </div>
              <div className="d-flex gap-2" style={{ flexWrap: 'wrap' }}>
                {property.badges.map(b => <Badge key={b} type={b} />)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
