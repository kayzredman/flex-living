import React from 'react';

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

export default function PropertyDetails({ property, onBack, onBook }) {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out', paddingBottom: '6rem' }}>
      <div style={{ position: 'relative', height: '300px' }}>
        <button 
          onClick={onBack}
          style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ←
        </button>
        <img src={property.image} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', bottom: '-20px', right: '20px' }}>
          <div style={{ background: 'white', padding: '10px 20px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: 'var(--teal)' }}>
            <span style={{ color: 'var(--success)' }}>✓</span> Audit Passed
          </div>
        </div>
      </div>

      <div style={{ padding: '2rem 1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{property.title}</h2>
        <p className="text-secondary mb-4">{property.city}</p>
        
        <div className="property-price mb-4">
          {property.currency} {property.price.toLocaleString()} <span>/ month</span>
        </div>

        <p style={{ lineHeight: 1.6, marginBottom: '2rem' }}>{property.description}</p>

        <div className="glass mb-4" style={{ borderRadius: '16px', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span role="img" aria-label="shield">🛡️</span> Flex-Trust Report
          </h3>
          <p className="text-sm text-secondary mb-3">Audited physically and cryptographically signed by {property.scout}</p>
          <div className="d-flex gap-2 mb-3" style={{ flexWrap: 'wrap' }}>
            {property.badges.map(b => <Badge key={b} type={b} />)}
          </div>
          <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
            <div className="d-flex justify-between mb-2">
              <span className="text-secondary">Generator Switchover:</span>
              <span className="font-bold">&lt; 10s (Verified)</span>
            </div>
            <div className="d-flex justify-between">
              <span className="text-secondary">Internet Speed:</span>
              <span className="font-bold">120 Mbps (Ookla Test)</span>
            </div>
          </div>
        </div>

        <div className="flex-advance-card mb-4">
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: 'white' }}>Flex-Stay SLA Protection</h3>
          <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '1rem' }}>
            If the power dies for &gt;2hrs, we move you and refund you. Automatically.
          </p>
          <button className="btn w-100" style={{ background: 'white', color: 'var(--teal)', padding: '0.5rem' }}>
            View SLA Matrix
          </button>
        </div>
      </div>

      <div className="glass" style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)' }}>
        <div>
          <div className="text-xs text-secondary">Total (Monthly)</div>
          <div className="font-bold" style={{ fontSize: '1.25rem' }}>{property.currency} {property.price.toLocaleString()}</div>
        </div>
        <button className="btn btn-primary" onClick={onBook}>
          Book Now
        </button>
      </div>
    </div>
  );
}
