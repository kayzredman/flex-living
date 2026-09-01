import React, { useState } from 'react';
import MapSplitView from '../components/MapSplitView';
import FlexAdvanceModal from '../components/FlexAdvanceModal';
import {
  ShieldCheckIcon,
  ZapIcon,
  WifiIcon,
  DropletsIcon,
  StarIcon,
  CheckCircleIcon,
  MapPinIcon
} from '../components/Icons';

export default function Home({ properties = [], onSelect, searchQuery = '', currency = 'GHS', flags = {} }) {
  const [activeCity, setActiveCity] = useState('All');
  const [showMap, setShowMap] = useState(false);
  const [calcProperty, setCalcProperty] = useState(null);

  const formatPrice = (prop) => {
    if (currency === 'USD') {
      const usdRate = prop.id === 1 ? 250 : prop.id === 2 ? 780 : 320;
      return `$${usdRate.toLocaleString()}/night`;
    }
    if (currency === 'NGN') {
      const ngnRate = prop.id === 1 ? 380000 : prop.id === 2 ? 1200000 : 490000;
      return `NGN ${(ngnRate >= 1000000 ? (ngnRate / 1000000).toFixed(1) + 'M' : ngnRate.toLocaleString())}/night`;
    }
    if (currency === 'KES') {
      const kesRate = prop.id === 1 ? 32000 : prop.id === 2 ? 95000 : 380000;
      return `KES ${kesRate.toLocaleString()}/night`;
    }
    // GHS
    return `GHS ${prop.price.toLocaleString()}/night`;
  };

  const filtered = properties.filter(p => {
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity = activeCity === 'All' || p.city.toLowerCase().includes(activeCity.toLowerCase());
    return matchesSearch && matchesCity;
  });

  return (
    <div style={{ backgroundColor: '#0E121A', minHeight: '100vh', color: '#FFFFFF', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem 2.5rem' }}>

        {/* HERO SECTION — EXACT REPLICATION OF FIGMA ARTBOARD 01 */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
          gap: '3rem',
          alignItems: 'center',
          marginBottom: '3.5rem',
          position: 'relative'
        }}>
          {/* Left Column: Heading, Subtitle & Gold Button */}
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '3.4rem',
              fontWeight: 900,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
              margin: '0 0 1.25rem 0'
            }}>
              Discover Exquisite Living<br />
              in Africa's Vibrant Cities
            </h1>

            <p style={{
              fontSize: '1.05rem',
              lineHeight: 1.6,
              color: '#94A3B8',
              maxWidth: '560px',
              margin: '0 0 2rem 0'
            }}>
              Curated short and long-term residences with 100% verified 24/7 solar power, dedicated high-speed Starlink broadband, and physical Field Scout audits.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <button
                onClick={() => {
                  const el = document.getElementById('properties-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  background: '#E9A319',
                  color: '#071520',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '14px 32px',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 6px 24px rgba(233, 163, 25, 0.35)',
                  transition: 'transform 0.2s ease, background 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#F59E0B'}
                onMouseLeave={(e) => e.target.style.background = '#E9A319'}
              >
                Explore Collection
              </button>

              {/* City Quick Pills */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {['All', 'Accra', 'Lagos', 'Nairobi'].map(city => (
                  <button
                    key={city}
                    onClick={() => setActiveCity(city)}
                    style={{
                      background: activeCity === city ? 'rgba(233,163,25,0.18)' : 'rgba(255,255,255,0.06)',
                      border: activeCity === city ? '1px solid #E9A319' : '1px solid rgba(255,255,255,0.1)',
                      color: activeCity === city ? '#E9A319' : '#94A3B8',
                      borderRadius: '20px',
                      padding: '8px 16px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Hero Architecture Imagery */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '100%',
              height: '380px',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
              position: 'relative'
            }}>
              <img 
                src="/accra.jpg" 
                alt="Contemporary African Villa"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(14,18,26,0.8) 0%, transparent 50%)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(7,21,32,0.85)', backdropFilter: 'blur(10px)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(233,163,25,0.4)' }}>
                  <ShieldCheckIcon size={16} color="#E9A319" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#FDE68A' }}>
                    99.5% INFRASTRUCTURE SLA GUARANTEE
                  </span>
                  <span style={{ width: '6px', height: '6px', borderRadius: '3px', background: '#10B981', display: 'inline-block' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION TITLE & MAP TOGGLE */}
        <div id="properties-grid" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Curated Master Residences
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#94A3B8', fontSize: '0.9rem' }}>
              Ground-truth physical audit by certified Field Scouts
            </p>
          </div>

          <button
            onClick={() => setShowMap(!showMap)}
            style={{
              background: showMap ? '#E9A319' : 'rgba(255,255,255,0.06)',
              color: showMap ? '#071520' : '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '20px',
              padding: '8px 18px',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <MapPinIcon size={14} color={showMap ? '#071520' : '#E9A319'} />
            {showMap ? 'Hide Map View' : 'Show Map View'}
          </button>
        </div>

        {/* PROPERTIES GRID — EXACT REPLICATION OF FIGMA ARTBOARD CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: showMap ? '1fr 480px' : 'repeat(auto-fit, minmax(460px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          {/* Left / Main Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: showMap ? '1fr' : 'repeat(auto-fit, minmax(460px, 1fr))', gap: '2.5rem' }}>
            {filtered.map(property => (
              <div 
                key={property.id}
                onClick={() => onSelect(property)}
                style={{
                  backgroundColor: '#161B26',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
                  cursor: 'pointer',
                  transition: 'transform 0.25s ease, border-color 0.25s ease',
                  padding: '20px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(233, 163, 25, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                {/* Large 16:9 Image with Rounded Corners */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '280px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  marginBottom: '18px'
                }}>
                  <img 
                    src={property.image} 
                    alt={property.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    background: 'rgba(7,21,32,0.85)',
                    backdropFilter: 'blur(10px)',
                    padding: '5px 12px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid rgba(255,255,255,0.15)'
                  }}>
                    <CheckCircleIcon size={14} color="#10B981" />
                    <span style={{ color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 800 }}>
                      200-POINT AUDITED
                    </span>
                  </div>

                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    background: 'rgba(7,21,32,0.85)',
                    backdropFilter: 'blur(10px)',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: '1px solid rgba(255,255,255,0.15)'
                  }}>
                    <StarIcon size={13} color="#E9A319" fill="#E9A319" />
                    <span style={{ color: '#FDE68A', fontSize: '0.75rem', fontWeight: 900 }}>
                      {property.rating}
                    </span>
                  </div>
                </div>

                {/* Title & Location */}
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  margin: '0 0 6px 0',
                  letterSpacing: '-0.02em'
                }}>
                  {property.title}
                </h3>

                {/* Price (Gold, Large) */}
                <div style={{
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  color: '#E9A319',
                  marginBottom: '10px'
                }}>
                  {formatPrice(property)}
                </div>

                {/* Specs Row: Beds | Baths | Sq Ft */}
                <div style={{
                  fontSize: '0.85rem',
                  color: '#94A3B8',
                  fontWeight: 600,
                  marginBottom: '10px'
                }}>
                  {property.beds} Beds &nbsp;|&nbsp; {property.baths} Baths &nbsp;|&nbsp; {property.sqft}
                </div>

                {/* Amenities Row */}
                <div style={{
                  fontSize: '0.8rem',
                  color: '#CBD5E1',
                  fontWeight: 700,
                  display: 'flex',
                  gap: '14px',
                  marginBottom: '18px'
                }}>
                  <span>🏊 Pool</span>
                  <span>🏋️ Gym</span>
                  <span>🏡 Smart Home</span>
                </div>

                {/* THE 4 SIGNATURE FIGMA TELEMETRY BADGES (EXACT REPLICATION) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                  background: '#0E121A',
                  padding: '12px',
                  borderRadius: '16px',
                  border: '1px solid rgba(233, 163, 25, 0.2)'
                }}>
                  {/* Badge 1: 24/7 Solar */}
                  <div style={{ textAlign: 'center', padding: '6px 2px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                      <ZapIcon size={16} color="#E9A319" fill="#E9A319" />
                    </div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#FDE68A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      24/7 SOLAR
                    </div>
                  </div>

                  {/* Badge 2: Starlink */}
                  <div style={{ textAlign: 'center', padding: '6px 2px', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                      <WifiIcon size={16} color="#E9A319" />
                    </div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#FDE68A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      STARLINK
                    </div>
                  </div>

                  {/* Badge 3: Pure Borehole */}
                  <div style={{ textAlign: 'center', padding: '6px 2px', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                      <DropletsIcon size={16} color="#E9A319" />
                    </div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#FDE68A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      PURE BOREHOLE
                    </div>
                  </div>

                  {/* Badge 4: 99.5% SLA */}
                  <div style={{ textAlign: 'center', padding: '6px 2px', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                      <ShieldCheckIcon size={16} color="#E9A319" />
                    </div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#FDE68A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      99.5% UPTIME SLA
                    </div>
                  </div>
                </div>

                {/* Hover CTA Footer */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255,255,255,0.06)'
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 800 }}>
                    ● 15% Escrow Protected
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(property);
                    }}
                    style={{
                      background: 'transparent',
                      color: '#E9A319',
                      border: '1px solid #E9A319',
                      borderRadius: '12px',
                      padding: '6px 14px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Map View (if active) */}
          {showMap && (
            <div style={{
              position: 'sticky',
              top: '90px',
              height: 'calc(100vh - 120px)',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
            }}>
              <MapSplitView properties={filtered} onSelect={onSelect} activeCity={activeCity} />
            </div>
          )}
        </div>

      </div>

      {/* Flex-Advance Modal */}
      {calcProperty && (
        <FlexAdvanceModal 
          property={calcProperty} 
          currency={currency} 
          onClose={() => setCalcProperty(null)} 
        />
      )}
    </div>
  );
}
