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
    <div className="screen-container" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      {/* Back button and breadcrumb */}
      <div className="d-flex align-center gap-3 mb-4">
        <button 
          onClick={onBack}
          className="btn glass"
          style={{ width: '40px', height: '40px', borderRadius: '50%', padding: 0, fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--teal)' }}
        >
          ←
        </button>
        <div>
          <span className="text-secondary text-xs">Verified Listings / {property.city}</span>
          <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--teal)' }}>{property.title}</h2>
        </div>
      </div>

      {/* 2-Column Responsive Details Grid */}
      <div className="details-grid">
        {/* Left Column: Media & Audit Reports */}
        <div>
          <div style={{ position: 'relative', height: '380px', borderRadius: '20px', overflow: 'hidden', marginBottom: '1.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
            <img src={property.image} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: '16px', right: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '8px 18px', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: 'var(--teal)' }}>
                <span style={{ color: 'var(--success)' }}>✓</span> 200+ Point Audit Passed
              </div>
            </div>
          </div>

          <div className="glass p-4 mb-4" style={{ borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--teal)', marginBottom: '0.75rem' }}>About this Property</h3>
            <p style={{ lineHeight: 1.7, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{property.description}</p>
          </div>

          {/* Flex-Trust Audit Report Card */}
          <div className="glass mb-4" style={{ borderRadius: '16px', padding: '1.5rem' }}>
            <div className="d-flex justify-between align-center mb-3">
              <h3 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--teal)' }}>
                <span>🛡️</span> Flex-Trust Field Scout Verification
              </h3>
              <span className="badge badge-verified">100% Score</span>
            </div>
            <p className="text-sm text-secondary mb-3">
              Physically verified on-site in {property.city} by Lead Scout <strong>{property.scout}</strong>.
            </p>
            <div className="d-flex gap-2 mb-4" style={{ flexWrap: 'wrap' }}>
              {property.badges.map(b => <Badge key={b} type={b} />)}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '12px' }}>
                <div className="text-secondary text-xs mb-1">ATS Auto-Switchover</div>
                <div className="font-bold text-teal" style={{ fontSize: '1.1rem' }}>&lt; 10s (Solar + Gen)</div>
              </div>
              <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '12px' }}>
                <div className="text-secondary text-xs mb-1">Ookla Internet Test</div>
                <div className="font-bold text-teal" style={{ fontSize: '1.1rem' }}>120 Mbps / 24ms</div>
              </div>
              <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '12px' }}>
                <div className="text-secondary text-xs mb-1">Water Autonomy</div>
                <div className="font-bold text-teal" style={{ fontSize: '1.1rem' }}>Borehole + 5,000L</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking & Flex-Advance Widget */}
        <div>
          <div className="glass-dark p-4 sticky-widget" style={{ borderRadius: '20px', position: 'sticky', top: '100px' }}>
            <div className="d-flex justify-between align-center mb-3">
              <div>
                <span className="text-xs" style={{ opacity: 0.8 }}>Monthly Verified Rent</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--coral)' }}>
                  {property.currency} {property.price.toLocaleString()}
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}> / mo</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--gold)', fontWeight: 'bold' }}>⭐ {property.rating}</div>
                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>42 Verified Reviews</span>
              </div>
            </div>

            <hr style={{ borderColor: 'rgba(255,255,255,0.15)', margin: '1rem 0' }} />

            {/* Flex-Advance Financing Highlight */}
            <div style={{ background: 'rgba(233,69,96,0.15)', border: '1px solid rgba(233,69,96,0.4)', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--coral-light)', fontSize: '0.95rem', marginBottom: '4px' }}>
                🚀 Eligible for Flex-Advance
              </div>
              <p style={{ fontSize: '0.8rem', opacity: 0.9, lineHeight: 1.4 }}>
                Avoid paying the traditional 1–2 year advance upfront. Pay monthly with employer payroll deduction.
              </p>
            </div>

            {/* SLA Protection Badge */}
            <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '0.875rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.25rem' }}>🛡️</span>
              <div style={{ fontSize: '0.8rem', lineHeight: 1.3 }}>
                <strong>99.5% Uptime SLA Guaranteed:</strong> Automated refund if power fails &gt; 2 hours.
              </div>
            </div>

            <button 
              className="btn btn-primary w-100" 
              style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: 700, borderRadius: '12px' }}
              onClick={onBook}
            >
              Proceed to Booking & Financing
            </button>

            <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.75rem', opacity: 0.7 }}>
              🔒 15% Host Escrow Hold • No Hidden Fees
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
