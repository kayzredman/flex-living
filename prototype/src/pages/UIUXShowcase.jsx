import React, { useState } from 'react';
import {
  ShieldCheckIcon,
  ZapIcon,
  WifiIcon,
  DropletsIcon,
  LockIcon,
  KeyIcon,
  SearchIcon,
  SlidersIcon,
  MapPinIcon,
  CompassIcon,
  CheckCircleIcon,
  StarIcon,
  TrendingUpIcon,
  BellIcon,
  CreditCardIcon,
  ChevronRightIcon,
  SparklesIcon,
  LayersIcon
} from '../components/Icons';

export default function UIUXShowcase({ onBack }) {
  const [activeCity, setActiveCity] = useState('Accra');
  const [currency, setCurrency] = useState('GHS');
  const [viewMode, setViewMode] = useState('SPLIT'); // 'SPLIT', 'PRO_MAX_ONLY', 'BEFORE_AFTER'
  const [isLiked, setIsLiked] = useState(false);

  const formatPrice = (ghs) => {
    if (currency === 'USD') return `$${Math.round(ghs / 15).toLocaleString()}`;
    if (currency === 'NGN') return `₦${(ghs * 105).toLocaleString()}`;
    return `GHS ${ghs.toLocaleString()}`;
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1360px', margin: '0 auto', fontFamily: 'var(--font-sans)' }}>
      {/* Top Breadcrumb & Prototype Notice */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              background: '#FFFFFF',
              color: '#0F3460',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            ← Back to Main App
          </button>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, rgba(233,163,25,0.15), rgba(233,69,96,0.15))', border: '1px solid #E9A319', padding: '6px 14px', borderRadius: '20px' }}>
            <SparklesIcon size={16} color="#E9A319" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#B45309' }}>
              PROTOTYPE PREVIEW • UI/UX PRO MAX DESIGN SYSTEM
            </span>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: '12px' }}>
          {[
            { key: 'SPLIT', label: 'Side-by-Side Comparison' },
            { key: 'PRO_MAX_ONLY', label: 'Pro Max Final Result' }
          ].map(m => (
            <button
              key={m.key}
              onClick={() => setViewMode(m.key)}
              style={{
                border: 'none',
                padding: '6px 14px',
                borderRadius: '9px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: viewMode === m.key ? '#FFFFFF' : 'transparent',
                color: viewMode === m.key ? '#0F3460' : '#64748B',
                boxShadow: viewMode === m.key ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section 1: Side-by-Side Comparison Table */}
      {viewMode === 'SPLIT' && (
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '24px', marginBottom: '2.5rem', boxShadow: '0 4px 20px -4px rgba(11,27,38,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <LayersIcon size={20} color="#0F3460" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F3460', margin: 0 }}>
              Direct Comparison: Amateur Emojis vs. Enterprise Vector SVGs
            </h2>
          </div>
          <p style={{ color: '#64748B', fontSize: '0.88rem', margin: '0 0 20px 0', lineHeight: 1.5 }}>
            See how precision vector graphics transform the perception of the platform from a school project to a institutional-grade African proptech leader competing with Airbnb Luxe.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Column 1: Before (Amateur Emojis) */}
            <div style={{ background: '#FFF7ED', borderRadius: '16px', border: '1.5px dashed #FDBA74', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                <div style={{ fontWeight: 800, color: '#C2410C', fontSize: '0.95rem' }}>
                  BEFORE: Raw Unicode Emojis (Unprofessional)
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: '#FFFFFF', padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>⚡</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1E293B' }}>⚡ 24/7 Solar Backup</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Inconsistent across Android, iOS, Windows, Mac</div>
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>🌐</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1E293B' }}>🌐 Starlink Satellite WiFi</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Looks like an emoji web globe, not enterprise satellite</div>
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>💧</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1E293B' }}>💧 Pure Borehole Reserve</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Comic drop of sweat/water</div>
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>🛡️</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1E293B' }}>🛡️ 99.5% SLA Escrow Guarantee</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Toy shield, low financial authority</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: After (UI/UX Pro Max) */}
            <div style={{ background: '#F0FDF4', borderRadius: '16px', border: '1.5px solid #86EFAC', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <CheckCircleIcon size={20} color="#15803D" />
                <div style={{ fontWeight: 800, color: '#15803D', fontSize: '0.95rem' }}>
                  AFTER: UI/UX Pro Max Precision Vectors (Institutional Grade)
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: '#FFFFFF', padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #DCFCE7' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(233,163,25,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ZapIcon size={18} color="#D97706" fill="#FDE68A" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F3460', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      24/7 Victron Solar Micro-Grid
                      <span style={{ width: '6px', height: '6px', borderRadius: '3px', background: '#10B981', display: 'inline-block' }} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>ATS Switchover &lt; 6.2s • Live Inverter Telemetry</div>
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #DCFCE7' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(6,182,212,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <WifiIcon size={18} color="#0891B2" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F3460' }}>Starlink Gen 3 Satellite Fleet</div>
                    <div style={{ fontSize: '0.75rem', color: '#0891B2', fontWeight: 600 }}>185 Mbps Downlink • 26ms Latency</div>
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #DCFCE7' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DropletsIcon size={18} color="#2563EB" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F3460' }}>Pure Deep Borehole Reserve</div>
                    <div style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 600 }}>5,000L Storage • TDS 65 PPM Laboratory Clean</div>
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #DCFCE7' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheckIcon size={18} color="#059669" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F3460' }}>99.5% Uptime SLA Escrow Shield</div>
                    <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>15% Host Retainer • Automated MoMo Payouts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Full UI/UX Pro Max Showcase */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F3460', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SparklesIcon size={18} color="#D97706" />
          Live Prototype: The Elevated African Luxury Experience
        </h3>

        {/* Luxury Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #071520 0%, #0F2537 50%, #153248 100%)',
          borderRadius: '24px',
          padding: '2.5rem 2.25rem',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '2rem',
          boxShadow: '0 20px 40px -15px rgba(7,21,32,0.5)',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          {/* Subtle Ambient Radial Glow */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(233,163,25,0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '760px' }}>
            {/* Live Uptime SLA Pill */}
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
                99.5% INFRASTRUCTURE UPTIME CONTRACT GUARANTEE
              </span>
              <span style={{ width: '6px', height: '6px', borderRadius: '3px', background: '#10B981', display: 'inline-block' }} />
            </div>

            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '0.85rem'
            }}>
              Vetted Urban Residences in <span style={{ color: '#E9A319' }}>Accra, Lagos & Nairobi</span>
            </h1>

            <p style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '1.05rem',
              lineHeight: 1.55,
              marginBottom: '1.75rem',
              maxWidth: '650px'
            }}>
              No surprise power cuts. No dry taps. Field Scout inspected with 200-point physical verification and automated Mobile Money escrow protection.
            </p>

            {/* Quick City Filters with Vector Pins */}
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', fontWeight: 600 }}>METRO:</span>
              {['All Metros', 'Accra', 'Lagos', 'Nairobi'].map(city => (
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
                    background: activeCity === city ? '#FFFFFF' : 'rgba(255,255,255,0.08)',
                    color: activeCity === city ? '#0F3460' : 'rgba(255,255,255,0.9)',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700,
                    transition: 'all 0.2s ease',
                    boxShadow: activeCity === city ? '0 4px 12px rgba(0,0,0,0.2)' : 'none'
                  }}
                >
                  <MapPinIcon size={14} color={activeCity === city ? '#0F3460' : '#94A3B8'} />
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Redesigned Property Cards with Floating Frosted Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {/* Demo Property Card 1 */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 20px -2px rgba(11,27,38,0.06)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {/* Image Container with Floating Badges */}
            <div style={{ position: 'relative', height: '240px' }}>
              <img
                src="/accra.jpg"
                alt="Cantonments Luxury Apartment"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Floating Top Left: Scout Audited Badge */}
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: 'rgba(11,27,38,0.85)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                padding: '4px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid rgba(255,255,255,0.15)'
              }}>
                <CheckCircleIcon size={14} color="#10B981" />
                <span style={{ color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.3px' }}>
                  200-POINT AUDITED
                </span>
              </div>

              {/* Floating Top Right: Favorite Button */}
              <button
                onClick={() => setIsLiked(!isLiked)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '34px',
                  height: '34px',
                  borderRadius: '17px',
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(8px)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                {isLiked ? '❤️' : '🤍'}
              </button>

              {/* Floating Bottom Left: Field Scout Lead Signature */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'rgba(15,52,96,0.9)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                padding: '4px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid rgba(233,163,25,0.3)'
              }}>
                <CompassIcon size={14} color="#E9A319" />
                <span style={{ color: 'rgba(255,255,255,0.95)', fontSize: '0.72rem', fontWeight: 700 }}>
                  Vetted by Ama (Accra Lead)
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Cantonments, Accra
                </span>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#FEF3C7', padding: '3px 8px', borderRadius: '12px' }}>
                  <StarIcon size={13} color="#D97706" fill="#D97706" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#B45309' }}>4.92</span>
                </div>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F3460', margin: '0 0 14px 0', letterSpacing: '-0.02em' }}>
                The Glasshouse Serviced Apartment #4B
              </h3>

              {/* Vector Badges Row (No Emojis!) */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(233,163,25,0.1)',
                  color: '#B45309',
                  border: '1px solid rgba(233,163,25,0.25)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  <ZapIcon size={13} color="#D97706" fill="#FDE68A" />
                  24/7 Solar Micro-Grid
                </span>

                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(6,182,212,0.1)',
                  color: '#0E7490',
                  border: '1px solid rgba(6,182,212,0.25)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  <WifiIcon size={13} color="#0891B2" />
                  Starlink 185 Mbps
                </span>

                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(59,130,246,0.1)',
                  color: '#1D4ED8',
                  border: '1px solid rgba(59,130,246,0.25)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  <DropletsIcon size={13} color="#2563EB" />
                  Pure Borehole Reserve
                </span>

                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(16,185,129,0.1)',
                  color: '#047857',
                  border: '1px solid rgba(16,185,129,0.25)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  <LockIcon size={13} color="#059669" />
                  Keyless Digital Door
                </span>
              </div>

              {/* Card Footer: Pricing & 1-Click Action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F3460' }}>
                    {formatPrice(4500)}
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}> / month</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircleIcon size={12} color="#059669" />
                    Flex-Advance Monthly Approved
                  </div>
                </div>

                <button
                  style={{
                    background: '#0F3460',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '9px 18px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(15,52,96,0.2)'
                  }}
                >
                  View Details
                  <ChevronRightIcon size={14} color="#FFFFFF" />
                </button>
              </div>
            </div>
          </div>

          {/* Demo Property Card 2 */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 20px -2px rgba(11,27,38,0.06)'
          }}>
            <div style={{ position: 'relative', height: '240px' }}>
              <img
                src="/lagos.jpg"
                alt="Lekki Phase 1 Studio"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: 'rgba(11,27,38,0.85)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                padding: '4px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid rgba(255,255,255,0.15)'
              }}>
                <CheckCircleIcon size={14} color="#10B981" />
                <span style={{ color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.3px' }}>
                  200-POINT AUDITED
                </span>
              </div>

              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'rgba(15,52,96,0.9)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                padding: '4px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid rgba(233,163,25,0.3)'
              }}>
                <CompassIcon size={14} color="#E9A319" />
                <span style={{ color: 'rgba(255,255,255,0.95)', fontSize: '0.72rem', fontWeight: 700 }}>
                  Vetted by Chinedu (Lagos Lead)
                </span>
              </div>
            </div>

            <div style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Lekki Phase 1, Lagos
                </span>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#FEF3C7', padding: '3px 8px', borderRadius: '12px' }}>
                  <StarIcon size={13} color="#D97706" fill="#D97706" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#B45309' }}>4.88</span>
                </div>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F3460', margin: '0 0 14px 0', letterSpacing: '-0.02em' }}>
                The Palms Minimalist Work-Ready Studio
              </h3>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(233,163,25,0.1)',
                  color: '#B45309',
                  border: '1px solid rgba(233,163,25,0.25)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  <ZapIcon size={13} color="#D97706" fill="#FDE68A" />
                  15kVA Solar Inverter
                </span>

                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(6,182,212,0.1)',
                  color: '#0E7490',
                  border: '1px solid rgba(6,182,212,0.25)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  <WifiIcon size={13} color="#0891B2" />
                  Dedicated Fibre 50 Mbps
                </span>

                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(16,185,129,0.1)',
                  color: '#047857',
                  border: '1px solid rgba(16,185,129,0.25)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  <ShieldCheckIcon size={13} color="#059669" />
                  Gated Armed Patrol
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F3460' }}>
                    {formatPrice(6500)}
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}> / month</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircleIcon size={12} color="#059669" />
                    Verified Escrow Protection
                  </div>
                </div>

                <button
                  style={{
                    background: '#0F3460',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '9px 18px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(15,52,96,0.2)'
                  }}
                >
                  View Details
                  <ChevronRightIcon size={14} color="#FFFFFF" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
