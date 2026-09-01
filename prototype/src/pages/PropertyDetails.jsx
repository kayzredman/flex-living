import React, { useState } from 'react';
import PhotoGalleryModal from '../components/PhotoGalleryModal';
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
      label: '24/7 Victron Solar Micro-Grid',
      icon: <ZapIcon size={14} color="#E9A319" fill="#E9A319" />,
      style: { background: 'rgba(233,163,25,0.12)', color: '#FDE68A', border: '1px solid rgba(233,163,25,0.3)' }
    },
    'POWER_WORK_READY': {
      label: '15kVA Solar Inverter Setup',
      icon: <ZapIcon size={14} color="#E9A319" fill="#E9A319" />,
      style: { background: 'rgba(233,163,25,0.12)', color: '#FDE68A', border: '1px solid rgba(233,163,25,0.3)' }
    },
    'INTERNET_100': {
      label: 'Starlink Gen 3 Satellite (185 Mbps)',
      icon: <WifiIcon size={14} color="#06B6D4" />,
      style: { background: 'rgba(6,182,212,0.12)', color: '#A5F3FC', border: '1px solid rgba(6,182,212,0.3)' }
    },
    'INTERNET_30': {
      label: 'Dedicated High-Speed Fibre (50 Mbps)',
      icon: <WifiIcon size={14} color="#06B6D4" />,
      style: { background: 'rgba(6,182,212,0.12)', color: '#A5F3FC', border: '1px solid rgba(6,182,212,0.3)' }
    },
    'SECURITY_FORTIFIED': {
      label: 'Gated Perimeter with Armed Security',
      icon: <ShieldCheckIcon size={14} color="#10B981" />,
      style: { background: 'rgba(16,185,129,0.12)', color: '#A7F3D0', border: '1px solid rgba(16,185,129,0.3)' }
    }
  };

  const badgeConfig = config[type];
  if (!badgeConfig) return null;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '0.78rem',
      fontWeight: 800,
      padding: '5px 12px',
      borderRadius: '12px',
      ...badgeConfig.style
    }}>
      {badgeConfig.icon}
      {badgeConfig.label}
    </span>
  );
};

export default function PropertyDetails({ property, onBack, onBook, currency = 'GHS', flags = {} }) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  const formatPrice = (priceGhs) => {
    if (currency === 'USD') return `$${Math.round(priceGhs / 15).toLocaleString()}`;
    if (currency === 'NGN') return `₦${(priceGhs * 105).toLocaleString()}`;
    return `GHS ${priceGhs.toLocaleString()}`;
  };

  return (
    <div className="screen-container" style={{ padding: '1.5rem 2rem', maxWidth: '1440px', margin: '0 auto', animation: 'fadeIn 0.25s ease-out' }}>
      {/* Header Breadcrumb & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button 
            onClick={onBack}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ←
          </button>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#E9A319', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              VERIFIED STAYS / {property.city}
            </span>
            <h1 style={{ fontSize: '1.85rem', margin: 0, color: '#FFFFFF', fontWeight: 900, letterSpacing: '-0.02em' }}>
              {property.title}
            </h1>
          </div>
        </div>

        {/* Share & Save Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '24px',
            padding: '8px 18px',
            fontSize: '0.82rem',
            fontWeight: 800,
            color: '#FFFFFF',
            cursor: 'pointer'
          }}>
            📤 Share
          </button>
          <button style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '24px',
            padding: '8px 18px',
            fontSize: '0.82rem',
            fontWeight: 800,
            color: '#E9A319',
            cursor: 'pointer'
          }}>
            🤍 Save
          </button>
        </div>
      </div>

      {/* 5-Photo Editorial Bento Grid */}
      <div 
        onClick={() => setIsGalleryOpen(true)}
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gridTemplateRows: 'repeat(2, 190px)',
          gap: '12px',
          borderRadius: '24px',
          overflow: 'hidden',
          marginBottom: '2rem',
          cursor: 'pointer',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ gridRow: 'span 2', position: 'relative', overflow: 'hidden' }}>
          <img src={property.image} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            background: 'rgba(7,21,32,0.85)',
            backdropFilter: 'blur(10px)',
            padding: '6px 12px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: '1px solid rgba(255,255,255,0.15)'
          }}>
            <CheckCircleIcon size={14} color="#10B981" />
            <span style={{ color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 800 }}>SCOUT AUDITED</span>
          </div>
        </div>

        <div style={{ overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" alt="Living Room" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80" alt="Solar Micro-Grid" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80" alt="Inverter Telemetry" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80" alt="Bedroom Suite" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(7,21,32,0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 900 }}>+4 Photos</span>
            <span style={{ fontSize: '0.75rem', color: '#E9A319', fontWeight: 700 }}>View All Gallery</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '2.5rem', alignItems: 'start' }}>
        {/* Left Column: Story, Telemetry, and Scout Verifications */}
        <div>
          {/* Host Byline Card */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#E9A319',
                color: '#071520',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.2rem'
              }}>
                FL
              </div>
              <div>
                <h4 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 800 }}>
                  Managed by Flex-Living Host Team
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                  Verified Host • 2-Year Escrow Guaranteed
                </span>
              </div>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(233,163,25,0.15)', padding: '4px 12px', borderRadius: '12px' }}>
              <StarIcon size={14} color="#E9A319" fill="#E9A319" />
              <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#FDE68A' }}>
                {property.rating}
              </span>
            </div>
          </div>

          {/* Property Description */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '0.85rem' }}>
              About this Property
            </h3>
            <p style={{ lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', margin: 0 }}>
              {property.description}
            </p>
          </div>

          {/* Flex-Trust Field Scout Full Report Card */}
          {flags.FLAG_200_POINT_TELEMETRY !== false && (
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '20px',
              padding: '1.75rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', fontWeight: 800 }}>
                  <ShieldCheckIcon size={20} color="#10B981" />
                  Flex-Trust Field Scout Verification
                </h3>
                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: '#10B981',
                  background: 'rgba(16,185,129,0.15)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  padding: '4px 12px',
                  borderRadius: '12px'
                }}>
                  100% Audit Score
                </span>
              </div>

              <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                Physically verified on-site in {property.city} by Lead Scout <strong>{property.scout}</strong>.
              </p>

              {/* Badges */}
              {flags.FLAG_VERIFIED_BADGES !== false && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  {property.badges.map(b => <Badge key={b} type={b} />)}
                </div>
              )}

              {/* 4 Telemetry Gauges Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div style={{ background: 'rgba(7,21,32,0.7)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E9A319', fontSize: '0.75rem', fontWeight: 800, marginBottom: '4px' }}>
                    <ZapIcon size={14} color="#E9A319" fill="#E9A319" />
                    AUTOMATIC TRANSFER SWITCH
                  </div>
                  <div style={{ fontWeight: 900, color: '#FFFFFF', fontSize: '1.15rem' }}>&lt; 6.2s switchover</div>
                  <p style={{ color: '#94A3B8', fontSize: '0.75rem', marginTop: '4px', margin: 0 }}>Victron solar inverter load tested</p>
                </div>

                <div style={{ background: 'rgba(7,21,32,0.7)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#06B6D4', fontSize: '0.75rem', fontWeight: 800, marginBottom: '4px' }}>
                    <WifiIcon size={14} color="#06B6D4" />
                    STARLINK SPEEDTEST
                  </div>
                  <div style={{ fontWeight: 900, color: '#FFFFFF', fontSize: '1.15rem' }}>185 Mbps / 24ms</div>
                  <p style={{ color: '#94A3B8', fontSize: '0.75rem', marginTop: '4px', margin: 0 }}>Gen 3 dish • 0 packet loss</p>
                </div>

                <div style={{ background: 'rgba(7,21,32,0.7)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3B82F6', fontSize: '0.75rem', fontWeight: 800, marginBottom: '4px' }}>
                    <DropletsIcon size={14} color="#3B82F6" />
                    WATER AUTONOMY
                  </div>
                  <div style={{ fontWeight: 900, color: '#FFFFFF', fontSize: '1.15rem' }}>Borehole + 5,000L</div>
                  <p style={{ color: '#94A3B8', fontSize: '0.75rem', marginTop: '4px', margin: 0 }}>TDS 65 PPM laboratory certified</p>
                </div>

                <div style={{ background: 'rgba(7,21,32,0.7)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontSize: '0.75rem', fontWeight: 800, marginBottom: '4px' }}>
                    <LockIcon size={14} color="#10B981" />
                    SMART KEY ACCESS
                  </div>
                  <div style={{ fontWeight: 900, color: '#FFFFFF', fontSize: '1.15rem' }}>TTLock BLE Actuator</div>
                  <p style={{ color: '#94A3B8', fontSize: '0.75rem', marginTop: '4px', margin: 0 }}>Keyless app pass + keypad master PIN</p>
                </div>
              </div>
            </div>
          )}

          {/* 99.5% SLA Guarantee Card */}
          {flags.FLAG_SLA_2HR_CURE_TIMER !== false && (
            <div style={{
              background: 'linear-gradient(135deg, #071520 0%, #0F2537 100%)',
              border: '1px solid rgba(233,163,25,0.3)',
              borderRadius: '20px',
              padding: '1.75rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(233,163,25,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ZapIcon size={20} color="#E9A319" fill="#E9A319" />
                </div>
                <div>
                  <h3 style={{ color: '#FFFFFF', margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                    Flex-Stay 99.5% Uptime SLA Escrow Guarantee
                  </h3>
                  <p style={{ color: '#E9A319', fontSize: '0.75rem', fontWeight: 700, margin: '2px 0 0 0' }}>
                    Automated Smart Contract & MoMo Escrow Protection
                  </p>
                </div>
              </div>

              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                If grid power and backup systems fail for &gt; 2 hours, Flex-Living automatically transfers compensation credit from the host's 15% escrow retainer directly to your Mobile Money wallet. Zero disputes.
              </p>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '8px 16px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>
                  ✓ Guaranteed $35/hr Outage Credit
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '8px 16px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>
                  ✓ Instant Relocation Voucher
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Booking & Flex-Advance Widget */}
        <div>
          <div style={{
            background: '#071520',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '24px',
            padding: '24px',
            position: 'sticky',
            top: '90px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                  Verified Monthly Rate
                </span>
                <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#E9A319', letterSpacing: '-0.02em' }}>
                  {formatPrice(property.price)}
                  <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}> / month</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(233,163,25,0.15)', padding: '4px 10px', borderRadius: '12px' }}>
                  <StarIcon size={14} color="#E9A319" fill="#E9A319" />
                  <span style={{ color: '#FDE68A', fontWeight: 900, fontSize: '0.9rem' }}>{property.rating}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px' }}>42 Verified Reviews</div>
              </div>
            </div>

            <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '1.25rem 0' }} />

            {/* Flex-Advance Monthly Facility Box */}
            <div style={{
              background: 'rgba(233,163,25,0.1)',
              border: '1px solid rgba(233,163,25,0.3)',
              borderRadius: '16px',
              padding: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: 900, color: '#FDE68A', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ZapIcon size={16} color="#E9A319" fill="#E9A319" />
                  Eligible for Flex-Advance
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#E9A319', color: '#071520', padding: '2px 8px', borderRadius: '8px' }}>
                  Prime 1.5%
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.45, marginBottom: '1rem' }}>
                Avoid paying {currency === 'USD' ? '$7,680' : 'GHS 96,000'} upfront for a 2-year lease. Pay monthly with employer payroll deduction.
              </p>
              <button
                onClick={() => setIsCalcOpen(true)}
                style={{
                  width: '100%',
                  background: '#FFFFFF',
                  color: '#071520',
                  border: 'none',
                  padding: '9px',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                📊 Calculate Cash Flow Savings
              </button>
            </div>

            {/* Escrow Guarantee Pill */}
            <div style={{
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: '14px',
              padding: '12px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <ShieldCheckIcon size={22} color="#10B981" />
              <div style={{ fontSize: '0.82rem', lineHeight: 1.4, color: 'rgba(255,255,255,0.9)' }}>
                <strong style={{ color: '#10B981' }}>15% Host Escrow Hold:</strong> Funds are released to host only after confirmed uptime.
              </div>
            </div>

            <button 
              onClick={onBook}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #E9A319, #D97706)',
                color: '#071520',
                border: 'none',
                padding: '1rem',
                fontSize: '1.05rem',
                fontWeight: 900,
                borderRadius: '14px',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(233,163,25,0.35)',
                transition: 'transform 0.15s ease'
              }}
            >
              Reserve with Flex-Advance →
            </button>

            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.72rem', color: '#94A3B8' }}>
              🔒 Bank-Grade Security • Paystack, MoMo & Card Supported
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PhotoGalleryModal
        property={property}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />

      <FlexAdvanceModal
        property={property}
        currency={currency}
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
        onApply={onBook}
      />
    </div>
  );
}
