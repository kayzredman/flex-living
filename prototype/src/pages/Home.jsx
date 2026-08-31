import React, { useState } from 'react';
import MapSplitView from '../components/MapSplitView';
import FlexAdvanceModal from '../components/FlexAdvanceModal';

const Badge = ({ type }) => {
  const config = {
    'POWER_247': { class: 'badge-power', label: '⚡ 24/7 Solar' },
    'POWER_WORK_READY': { class: 'badge-power', label: '⚡ Inverter Backup' },
    'INTERNET_100': { class: 'badge-internet', label: '🌐 100Mbps Starlink' },
    'INTERNET_30': { class: 'badge-internet', label: '🌐 30Mbps Fibre' },
    'SECURITY_FORTIFIED': { class: 'badge-security', label: '🛡️ Gated & Guarded' },
  };
  const badgeConfig = config[type];
  if (!badgeConfig) return null;

  return (
    <span className={`badge ${badgeConfig.class}`} style={{ fontSize: '0.75rem', padding: '3px 8px' }}>
      {badgeConfig.label}
    </span>
  );
};

export default function Home({ properties, onSelect, searchQuery = '', currency = 'GHS' }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeCity, setActiveCity] = useState('All');
  const [showMap, setShowMap] = useState(true);
  const [likedProperties, setLikedProperties] = useState(new Set());
  const [calcProperty, setCalcProperty] = useState(null);

  const toggleLike = (e, id) => {
    e.stopPropagation();
    setLikedProperties(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const formatPrice = (priceGhs) => {
    if (currency === 'USD') return `$${Math.round(priceGhs / 15).toLocaleString()}`;
    if (currency === 'NGN') return `₦${(priceGhs * 105).toLocaleString()}`;
    return `GHS ${priceGhs.toLocaleString()}`;
  };

  const filtered = properties.filter(p => {
    // Search query filter
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.badges.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));

    // City filter
    const matchesCity = activeCity === 'All' || p.city.toLowerCase().includes(activeCity.toLowerCase());

    // Badge filter
    let matchesBadge = true;
    if (activeFilter.includes('Power')) matchesBadge = p.badges.some(b => b.includes('POWER'));
    if (activeFilter.includes('Fibre')) matchesBadge = p.badges.some(b => b.includes('INTERNET'));
    if (activeFilter.includes('Security')) matchesBadge = p.badges.some(b => b.includes('SECURITY'));

    return matchesSearch && matchesCity && matchesBadge;
  });

  return (
    <div className="screen-container">
      {/* Luxury Hero Banner */}
      <div className="glass-dark mb-4" style={{ borderRadius: '24px', padding: '2.5rem 2.25rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(233,163,25,0.2)', padding: '5px 14px', borderRadius: '20px', color: 'var(--gold-light)', fontSize: '0.8rem', fontWeight: 800, marginBottom: '1rem', border: '1px solid rgba(233,163,25,0.3)' }}>
            <span>⭐</span> 99.5% INFRASTRUCTURE UPTIME GUARANTEE
          </div>
          <h1 style={{ fontSize: '2.4rem', color: 'white', marginBottom: '0.75rem', lineHeight: 1.15 }}>
            Verified Living in Accra, Lagos & Nairobi
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.5, marginBottom: '1.75rem' }}>
            No surprise blackouts. No dry taps. Ground-truth audited by Field Scouts with instant automated refund guarantees.
          </p>

          {/* Quick City Filters */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 600 }}>Destination:</span>
            {['All', 'Accra', 'Lagos', 'Nairobi'].map(city => (
              <button 
                key={city}
                style={{
                  padding: '6px 16px',
                  fontSize: '0.85rem',
                  borderRadius: '20px',
                  background: activeCity === city ? 'white' : 'rgba(255,255,255,0.1)',
                  color: activeCity === city ? 'var(--teal)' : 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setActiveCity(city)}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar: Category Filters & Airbnb Split Map Toggle */}
      <div className="d-flex justify-between align-center mb-4" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        {/* Amenity Filter Chips */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {['All', '⚡ 24/7 Power', '🌐 Starlink Ultra Fibre', '🛡️ Guarded Security'].map(filter => (
            <button 
              key={filter}
              className="btn"
              style={{
                padding: '0.45rem 1.15rem',
                fontSize: '0.85rem',
                borderRadius: '20px',
                background: activeFilter === filter ? 'var(--coral)' : 'white',
                color: activeFilter === filter ? 'white' : 'var(--text-secondary)',
                border: activeFilter === filter ? '1px solid var(--coral)' : '1px solid var(--border)',
                cursor: 'pointer',
                fontWeight: 600,
                boxShadow: activeFilter === filter ? '0 4px 12px rgba(233,69,96,0.3)' : 'none'
              }}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* View Mode Toggle (Split Map vs Grid) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setShowMap(!showMap)}
            className="btn glass"
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '0.8rem',
              color: 'var(--teal)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid var(--border)',
              background: showMap ? 'rgba(15, 52, 96, 0.08)' : 'white'
            }}
          >
            {showMap ? 'Hide Map ✕' : 'Show Map 🗺️'}
          </button>
        </div>
      </div>

      {/* Main Content Layout: Grid + Side Map */}
      <div style={{ display: 'grid', gridTemplateColumns: showMap ? '1fr 480px' : '1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left Side: Property Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: showMap ? 'repeat(auto-fill, minmax(280px, 1fr))' : 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(property => {
            const isLiked = likedProperties.has(property.id);
            return (
              <div 
                key={property.id} 
                className="property-card"
                onClick={() => onSelect(property)}
                style={{ cursor: 'pointer' }}
              >
                {/* Image Container with Badges */}
                <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                  <img 
                    src={property.image} 
                    alt={property.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <button
                      onClick={(e) => toggleLike(e, property.id)}
                      className={`btn-heart ${isLiked ? 'liked' : ''}`}
                    >
                      {isLiked ? '❤️' : '🤍'}
                    </button>
                  </div>

                  {/* Scout Signature Pill */}
                  {flags.FLAG_200_POINT_TELEMETRY !== false && (
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(15,52,96,0.9)', backdropFilter: 'blur(8px)', padding: '5px 12px', borderRadius: '12px', color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>
                      Audited by {property.scout}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="property-card-content" style={{ padding: '1.25rem' }}>
                  <div className="d-flex justify-between align-center mb-1">
                    <span className="text-secondary text-xs font-bold">📍 {property.city}</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--gold-dark)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      ⭐ {property.rating}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', margin: '0 0 0.5rem 0', color: 'var(--teal)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {property.title}
                  </h3>

                  {/* Price */}
                  <div className="d-flex justify-between align-center mb-3">
                    <div className="property-price" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--coral)' }}>
                      {formatPrice(property.price)} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/ mo</span>
                    </div>

                    {/* Flex-Advance Mini Badge */}
                    {flags.FLAG_FLEX_ADVANCE_MONTHLY !== false && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setCalcProperty(property); }}
                        style={{
                          background: 'rgba(233,69,96,0.1)',
                          border: '1px solid rgba(233,69,96,0.25)',
                          color: 'var(--coral)',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        🚀 Flex-Advance
                      </button>
                    )}
                  </div>

                  {/* Amenity Badges */}
                  {flags.FLAG_VERIFIED_BADGES !== false && (
                    <div className="d-flex gap-2" style={{ flexWrap: 'wrap' }}>
                      {property.badges.map(b => <Badge key={b} type={b} />)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Interactive Split Map */}
        {showMap && (
          <MapSplitView
            properties={filtered}
            onSelectProperty={onSelect}
            currency={currency}
          />
        )}
      </div>

      {/* Flex-Advance Simulator Modal */}
      {calcProperty && (
        <FlexAdvanceModal
          property={calcProperty}
          currency={currency}
          isOpen={!!calcProperty}
          onClose={() => setCalcProperty(null)}
          onApply={() => { onSelect(calcProperty); }}
        />
      )}
    </div>
  );
}
