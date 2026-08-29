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
  
  const filtered = activeFilter === 'All' 
    ? properties 
    : properties.filter(p => {
        if (activeFilter.includes('Power')) return p.badges.some(b => b.includes('POWER'));
        if (activeFilter.includes('Fibre')) return p.badges.some(b => b.includes('INTERNET'));
        if (activeFilter.includes('Security')) return p.badges.some(b => b.includes('SECURITY'));
        return true;
      });

  return (
    <div className="screen-container">
      {/* Hero Section */}
      <div className="glass-dark mb-5" style={{ borderRadius: '20px', padding: '2.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(233,163,25,0.2)', padding: '4px 12px', borderRadius: '16px', color: 'var(--gold-light)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
            <span>⭐</span> 99.5% INFRASTRUCTURE UPTIME SLA
          </div>
          <h1 style={{ fontSize: '2.2rem', color: 'white', marginBottom: '0.75rem', lineHeight: 1.15 }}>
            Verified Living in Accra, Lagos & Nairobi
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            No surprise blackouts. No dry taps. Ground-truth audited by Field Scouts with instant automated refund guarantees.
          </p>

          {/* Quick Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['All', '⚡ Power 24/7', '🌐 Ultra Fibre', '🛡️ Security'].map(filter => (
              <button 
                key={filter}
                className="btn"
                style={{
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.85rem',
                  borderRadius: '24px',
                  background: activeFilter === filter ? 'var(--coral)' : 'rgba(255,255,255,0.12)',
                  color: 'white',
                  border: activeFilter === filter ? '1px solid var(--coral-light)' : '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Listings Section */}
      <div className="mb-4 d-flex justify-between align-center">
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--teal)', margin: 0 }}>Scout-Audited Listings</h2>
          <p className="text-secondary text-sm">Showing {filtered.length} verified spaces</p>
        </div>
        <div className="d-flex gap-2">
          <span className="badge badge-verified">✓ PostGIS Spatial Filter</span>
        </div>
      </div>

      {/* Responsive Property Grid */}
      <div className="property-grid">
        {filtered.map(property => (
          <div key={property.id} className="property-card glass" onClick={() => onSelect(property)} style={{ cursor: 'pointer', borderRadius: '16px', overflow: 'hidden', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
            <div className="property-card-image" style={{ height: '220px', position: 'relative' }}>
              <img src={property.image} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                <span className="badge badge-verified" style={{ backdropFilter: 'blur(8px)', background: 'rgba(16,185,129,0.95)' }}>
                  ✓ Flex-Audited
                </span>
              </div>
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(15,52,96,0.85)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '8px', color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>
                Audited by {property.scout}
              </div>
            </div>
            <div className="property-card-content" style={{ padding: '1.25rem' }}>
              <div className="d-flex justify-between align-center mb-2">
                <span className="text-secondary text-sm" style={{ fontWeight: 500 }}>📍 {property.city}</span>
                <span className="text-sm font-bold" style={{ color: 'var(--gold-dark)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ⭐ {property.rating}
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--teal)' }}>{property.title}</h3>
              <div className="property-price mb-3" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--coral)' }}>
                {property.currency} {property.price.toLocaleString()} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/ month</span>
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
