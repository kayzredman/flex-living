import React from 'react';

export default function PhotoGalleryModal({ property, isOpen, onClose }) {
  if (!isOpen) return null;

  const auditPhotos = [
    { title: 'Living Room & Work Area', url: property.image, tag: 'Spacious & Bright' },
    { title: 'Solar Inverter & Lithium Battery', url: '/accra.jpg', tag: '⚡ 5kVA Victron Energy' },
    { title: 'Starlink Gen 3 Satellite & Router', url: '/lagos.jpg', tag: '🌐 180 Mbps Tested' },
    { title: 'Water Filtration & 5000L Reserve Tank', url: '/nairobi.jpg', tag: '💧 45 PSI Constant Pressure' },
    { title: 'Smart Digital Lock Access', url: property.image, tag: '🔐 Keyless NFC & Passcode' },
    { title: 'Bedroom Suite', url: '/accra.jpg', tag: 'A/C Inverter Equipped' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(10, 15, 30, 0.96)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeIn 0.25s ease'
      }}
    >
      {/* Gallery Header */}
      <div
        style={{
          padding: '1.25rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div>
          <span className="badge badge-verified mb-1">✓ 200+ Point Audit Proof</span>
          <h3 style={{ color: 'white', margin: 0, fontSize: '1.35rem' }}>{property.title} • Ground-Truth Photos</h3>
        </div>
        <button
          onClick={onClose}
          className="btn glass"
          style={{
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            padding: 0,
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: 800,
            background: 'rgba(255, 255, 255, 0.15)'
          }}
        >
          ✕
        </button>
      </div>

      {/* Grid of Verified Photos */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {auditPhotos.map((photo, i) => (
            <div key={i} className="glass-dark" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
                <img src={photo.url} alt={photo.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(15, 52, 96, 0.9)',
                    backdropFilter: 'blur(8px)',
                    color: 'var(--gold-light)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '8px'
                  }}
                >
                  {photo.tag}
                </span>
              </div>
              <div style={{ padding: '1rem' }}>
                <h4 style={{ color: 'white', fontSize: '1rem', margin: 0 }}>{photo.title}</h4>
                <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Verified by Lead Scout {property.scout}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
