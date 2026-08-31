import React, { useState } from 'react';

export default function MapSplitView({ properties, onSelectProperty, selectedPropertyId, currency, exchangeRate }) {
  const [activeCity, setActiveCity] = useState('Accra');
  const [hoveredProperty, setHoveredProperty] = useState(null);
  const [zoom, setZoom] = useState(1);

  // Filter properties by city
  const cityProperties = properties.filter(p => p.city.toLowerCase().includes(activeCity.toLowerCase()));

  // Map coordinates simulation
  const pinPositions = {
    1: { x: 42, y: 48, name: 'Cantonments, Accra' },
    2: { x: 62, y: 55, name: 'Lekki Phase 1, Lagos' },
    3: { x: 55, y: 38, name: 'Kilimani, Nairobi' },
  };

  const formatPrice = (priceGhs) => {
    if (currency === 'USD') return `$${Math.round(priceGhs / 15).toLocaleString()}`;
    if (currency === 'NGN') return `₦${(priceGhs * 105).toLocaleString()}`;
    return `GHS ${priceGhs.toLocaleString()}`;
  };

  return (
    <div className="interactive-map-panel" style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {/* Map Header Toolbar */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
        <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
          {['Accra', 'Lagos', 'Nairobi'].map(city => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className="btn glass"
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: activeCity === city ? 'var(--teal)' : 'rgba(255,255,255,0.9)',
                color: activeCity === city ? 'white' : 'var(--teal)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              📍 {city}
            </button>
          ))}
        </div>

        {/* Live Infrastructure Overlay Badge */}
        <div className="glass" style={{ pointerEvents: 'auto', padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.95)' }}>
          <span style={{ animation: 'pulse 1.5s infinite', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }}></span>
          PostGIS Grid Verified
        </div>
      </div>

      {/* Map Canvas with Luxury Dark Theme & Spatial Pins */}
      <div style={{ flex: 1, width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#0b1329' }}>
        {/* SVG Grid Lines & Roads */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.6 }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </pattern>
            <radialGradient id="cityGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a365d" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0b1329" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <circle cx="50%" cy="50%" r="40%" fill="url(#cityGlow)" />
          
          {/* Simulated Coastline & Roads */}
          <path d="M 0 350 Q 200 320 400 360 T 800 340" fill="none" stroke="rgba(233,163,25,0.25)" strokeWidth="3" />
          <path d="M 150 0 Q 250 200 300 600" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          <path d="M 50 180 Q 300 220 600 150" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          <path d="M 280 120 Q 380 300 420 500" fill="none" stroke="rgba(233,69,96,0.3)" strokeWidth="2" strokeDasharray="4,4" />
        </svg>

        {/* Dynamic Interactive Property Pins */}
        {properties.map(property => {
          const coords = pinPositions[property.id] || { x: 50, y: 50 };
          const isSelected = selectedPropertyId === property.id || hoveredProperty?.id === property.id;

          return (
            <div
              key={property.id}
              onClick={() => onSelectProperty(property)}
              onMouseEnter={() => setHoveredProperty(property)}
              onMouseLeave={() => setHoveredProperty(null)}
              style={{
                position: 'absolute',
                top: `${coords.y}%`,
                left: `${coords.x}%`,
                transform: `translate(-50%, -50%) scale(${isSelected ? 1.15 : 1})`,
                zIndex: isSelected ? 30 : 20,
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Airbnb-style Price Capsule Marker */}
              <div
                style={{
                  background: isSelected ? 'var(--coral)' : 'white',
                  color: isSelected ? 'white' : 'var(--teal)',
                  padding: '6px 12px',
                  borderRadius: '24px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  boxShadow: isSelected 
                    ? '0 6px 20px rgba(233,69,96,0.6)' 
                    : '0 4px 14px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  border: isSelected ? '2px solid white' : '1px solid var(--border)',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>⚡</span> {formatPrice(property.price)}
              </div>
            </div>
          );
        })}

        {/* Hover Popover Preview Card */}
        {hoveredProperty && (
          <div
            onClick={() => onSelectProperty(hoveredProperty)}
            className="glass"
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              right: '24px',
              zIndex: 40,
              borderRadius: '16px',
              padding: '12px',
              display: 'flex',
              gap: '14px',
              alignItems: 'center',
              cursor: 'pointer',
              animation: 'fadeIn 0.2s ease'
            }}
          >
            <img
              src={hoveredProperty.image}
              alt={hoveredProperty.title}
              style={{ width: '80px', height: '70px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="d-flex justify-between align-center">
                <span className="text-xs font-bold text-secondary">{hoveredProperty.city}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 700 }}>⭐ {hoveredProperty.rating}</span>
              </div>
              <h4 style={{ fontSize: '0.95rem', margin: '2px 0 4px 0', color: 'var(--teal)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {hoveredProperty.title}
              </h4>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--coral)' }}>
                {formatPrice(hoveredProperty.price)} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/ mo</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Map Controls */}
        <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            onClick={() => setZoom(z => Math.min(z + 0.2, 1.6))}
            className="btn glass"
            style={{ width: '36px', height: '36px', borderRadius: '50%', padding: 0, fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--teal)' }}
          >
            +
          </button>
          <button
            onClick={() => setZoom(z => Math.max(z - 0.2, 0.8))}
            className="btn glass"
            style={{ width: '36px', height: '36px', borderRadius: '50%', padding: 0, fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--teal)' }}
          >
            -
          </button>
        </div>
      </div>
    </div>
  );
}
