import React, { useState } from 'react';
import MapSplitView from '../components/MapSplitView';
import FlexAdvanceModal from '../components/FlexAdvanceModal';
import {
  ShieldCheckIcon,
  ZapIcon,
  WifiIcon,
  DropletsIcon,
  LockIcon,
  StarIcon,
  CheckCircleIcon,
  MapPinIcon,
  CompassIcon,
  ChevronRightIcon
} from '../components/Icons';

const Badge = ({ type }) => {
  const config = {
    'POWER_247': {
      label: '24/7 Victron Solar',
      icon: <ZapIcon size={13} color="#E9A319" fill="#E9A319" />,
      style: { background: 'rgba(233,163,25,0.12)', color: '#FDE68A', border: '1px solid rgba(233,163,25,0.3)' }
    },
    'POWER_WORK_READY': {
      label: '15kVA Solar Inverter',
      icon: <ZapIcon size={13} color="#E9A319" fill="#E9A319" />,
      style: { background: 'rgba(233,163,25,0.12)', color: '#FDE68A', border: '1px solid rgba(233,163,25,0.3)' }
    },
    'INTERNET_100': {
      label: 'Starlink 185 Mbps',
      icon: <WifiIcon size={13} color="#06B6D4" />,
      style: { background: 'rgba(6,182,212,0.12)', color: '#A5F3FC', border: '1px solid rgba(6,182,212,0.3)' }
    },
    'INTERNET_30': {
      label: 'Dedicated Fibre 50 Mbps',
      icon: <WifiIcon size={13} color="#06B6D4" />,
      style: { background: 'rgba(6,182,212,0.12)', color: '#A5F3FC', border: '1px solid rgba(6,182,212,0.3)' }
    },
    'SECURITY_FORTIFIED': {
      label: 'Gated Armed Security',
      icon: <ShieldCheckIcon size={13} color="#10B981" />,
      style: { background: 'rgba(16,185,129,0.12)', color: '#A7F3D0', border: '1px solid rgba(16,185,129,0.3)' }
    }
  };

  const badgeConfig = config[type];
  if (!badgeConfig) return null;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      fontSize: '0.72rem',
      fontWeight: 800,
      padding: '4px 10px',
      borderRadius: '10px',
      ...badgeConfig.style
    }}>
      {badgeConfig.icon}
      {badgeConfig.label}
    </span>
  );
};

export default function Home({ properties = [], onSelect, searchQuery = '', currency = 'GHS', flags = {} }) {
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
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.badges.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCity = activeCity === 'All' || p.city.toLowerCase().includes(activeCity.toLowerCase());

    let matchesBadge = true;
    if (activeFilter.includes('Power')) matchesBadge = p.badges.some(b => b.includes('POWER'));
    if (activeFilter.includes('Starlink') || activeFilter.includes('Fibre')) matchesBadge = p.badges.some(b => b.includes('INTERNET'));
    if (activeFilter.includes('Security')) matchesBadge = p.badges.some(b => b.includes('SECURITY'));

    return matchesSearch && matchesCity && matchesBadge;
  });

  return (
    <div className="screen-container" style={{ padding: '1.5rem 2rem', maxWidth: '1560px', margin: '0 auto' }}>
      {/* Luxury African Hero Banner (Figma Master Canvas) */}
      <div style={{
        background: 'linear-gradient(135deg, #071520 0%, #0F2537 50%, #153248 100%)',
        borderRadius: '24px',
        padding: '2.5rem 2.25rem',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '2rem',
        boxShadow: '0 20px 40px -15px rgba(7,21,32,0.6)',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        {/* Ambient Gold Radial Glow */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(233,163,25,0.18) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '780px' }}>
          {/* Live Uptime SLA Escrow Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(233,163,25,0.35)',
            padding: '6px 14px',
            borderRadius: '24px',
            marginBottom: '1.25rem'
          }}>
            <ShieldCheckIcon size={16} color="#E9A319" />
            <span style={{ color: '#FDE68A', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.5px' }}>
              99.5% INFRASTRUCTURE UPTIME SLA ESCROW
            </span>
            <span style={{ width: '6px', height: '6px', borderRadius: '3px', background: '#10B981', boxShadow: '0 0 8px #10B981', display: 'inline-block' }} />
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '0.85rem'
          }}>
            Discover Exquisite Living in <span style={{ color: '#E9A319' }}>Africa's Vibrant Capitals</span>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '1.05rem',
            lineHeight: 1.55,
            marginBottom: '1.75rem',
            maxWidth: '680px'
          }}>
            No surprise blackouts. No dry taps. Physical 200-point inspection by certified Field Scouts with instant Mobile Money escrow protection.
          </p>

          {/* Quick City Filters with Vector Pins */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', fontWeight: 600 }}>DESTINATION:</span>
            {['All', 'Accra', 'Lagos', 'Nairobi'].map(city => (
              <button 
                key={city}
                onClick={() => setActiveCity(city)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 16px',
                  fontSize: '0.82rem',
                  borderRadius: '20px',
                  background: activeCity === city ? '#E9A319' : 'rgba(255,255,255,0.08)',
                  color: activeCity === city ? '#071520' : 'rgba(255,255,255,0.9)',
                  border: activeCity === city ? '1.5px solid #E9A319' : '1px solid rgba(255,255,255,0.12)',
                  cursor: 'pointer',
                  fontWeight: 800,
                  transition: 'all 0.2s ease',
                  boxShadow: activeCity === city ? '0 4px 14px rgba(233,163,25,0.3)' : 'none'
                }}
              >
                <MapPinIcon size={14} color={activeCity === city ? '#071520' : '#E9A319'} />
                {city === 'All' ? 'All Metros' : city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar: Category Filters & View Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Amenity Filter Chips */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {[
            { label: 'All', icon: null },
            { label: '24/7 Solar Micro-Grid', icon: <ZapIcon size={14} color={activeFilter === '24/7 Solar Micro-Grid' ? '#071520' : '#E9A319'} fill={activeFilter === '24/7 Solar Micro-Grid' ? '#071520' : '#E9A319'} /> },
            { label: 'Starlink Ultra Satellite', icon: <WifiIcon size={14} color={activeFilter === 'Starlink Ultra Satellite' ? '#071520' : '#06B6D4'} /> },
            { label: 'Guarded Armed Security', icon: <ShieldCheckIcon size={14} color={activeFilter === 'Guarded Armed Security' ? '#071520' : '#10B981'} /> }
          ].map(item => (
            <button 
              key={item.label}
              onClick={() => setActiveFilter(item.label)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.45rem 1.15rem',
                fontSize: '0.82rem',
                borderRadius: '20px',
                background: activeFilter === item.label ? '#E9A319' : 'rgba(255,255,255,0.06)',
                color: activeFilter === item.label ? '#071520' : '#FFFFFF',
                border: activeFilter === item.label ? '1px solid #E9A319' : '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                fontWeight: 700,
                transition: 'all 0.2s ease',
                boxShadow: activeFilter === item.label ? '0 4px 12px rgba(233,163,25,0.25)' : 'none'
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setShowMap(!showMap)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '0.8rem',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: showMap ? 'rgba(233,163,25,0.15)' : 'rgba(255,255,255,0.06)',
              cursor: 'pointer'
            }}
          >
            {showMap ? 'Hide Map ✕' : 'Show Map 🗺️'}
          </button>
        </div>
      </div>

      {/* Main Content Layout: Grid + Side Map */}
      <div style={{ display: 'grid', gridTemplateColumns: showMap ? '1fr 480px' : '1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left Side: Luxury Property Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: showMap ? 'repeat(auto-fill, minmax(290px, 1fr))' : 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(property => {
            const isLiked = likedProperties.has(property.id);
            return (
              <div 
                key={property.id} 
                onClick={() => onSelect(property)}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                {/* Image Box with Floating Badges */}
                <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                  <img 
                    src={property.image} 
                    alt={property.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Top Left: 200-Point Audit Pill */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(7,21,32,0.85)',
                    backdropFilter: 'blur(10px)',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid rgba(255,255,255,0.12)'
                  }}>
                    <CheckCircleIcon size={13} color="#10B981" />
                    <span style={{ color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.3px' }}>
                      200-POINT AUDITED
                    </span>
                  </div>

                  {/* Top Right: Favorite Button */}
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <button
                      onClick={(e) => toggleLike(e, property.id)}
                      style={{
                        background: 'rgba(7,21,32,0.7)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        width: '32px',
                        height: '32px',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      {isLiked ? '❤️' : '🤍'}
                    </button>
                  </div>

                  {/* Bottom Left: Scout Signature Pill */}
                  {flags.FLAG_200_POINT_TELEMETRY !== false && (
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      background: 'rgba(7,21,32,0.9)',
                      backdropFilter: 'blur(8px)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      border: '1px solid rgba(233,163,25,0.3)'
                    }}>
                      <CompassIcon size={13} color="#E9A319" />
                      Audited by {property.scout}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div style={{ padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#E9A319', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {property.city}
                    </span>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(233,163,25,0.15)', padding: '2px 8px', borderRadius: '10px' }}>
                      <StarIcon size={12} color="#E9A319" fill="#E9A319" />
                      <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#FDE68A' }}>
                        {property.rating}
                      </span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 12px 0', letterSpacing: '-0.02em' }}>
                    {property.title}
                  </h3>

                  {/* Infrastructure Badges Row */}
                  {flags.FLAG_VERIFIED_BADGES !== false && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                      {property.badges.map((badge, idx) => (
                        <Badge key={idx} type={badge} />
                      ))}
                    </div>
                  )}

                  {/* Card Footer: Pricing & Action */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div>
                      <div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#E9A319' }}>
                          {formatPrice(property.price)}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}> / month</span>
                      </div>
                      {flags.FLAG_FLEX_ADVANCE_MONTHLY !== false && (
                        <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <CheckCircleIcon size={11} color="#10B981" />
                          Flex-Advance Approved
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(property);
                      }}
                      style={{
                        background: '#E9A319',
                        color: '#071520',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        boxShadow: '0 4px 12px rgba(233,163,25,0.25)',
                        transition: 'background 0.2s'
                      }}
                    >
                      View Details
                      <ChevronRightIcon size={13} color="#071520" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Map Split View */}
        {showMap && (
          <div style={{ position: 'sticky', top: '90px', height: 'calc(100vh - 120px)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
            <MapSplitView properties={filtered} onSelect={onSelect} activeCity={activeCity} />
          </div>
        )}
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
