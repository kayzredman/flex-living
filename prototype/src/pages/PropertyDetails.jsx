import React, { useState } from 'react';
import PhotoGalleryModal from '../components/PhotoGalleryModal';
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
    <span className={`badge ${badgeConfig.class}`} style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
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
    <div className="screen-container" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      {/* Header Breadcrumb & Actions */}
      <div className="d-flex justify-between align-center mb-4">
        <div className="d-flex align-center gap-3">
          <button 
            onClick={onBack}
            className="btn glass"
            style={{ width: '42px', height: '42px', borderRadius: '50%', padding: 0, fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--teal)' }}
          >
            ←
          </button>
          <div>
            <span className="text-secondary text-xs font-bold">Verified Stays / {property.city}</span>
            <h1 style={{ fontSize: '1.85rem', margin: 0, color: 'var(--teal)', lineHeight: 1.2 }}>{property.title}</h1>
          </div>
        </div>

        {/* Share & Save Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn glass" style={{ borderRadius: '24px', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--teal)' }}>
            📤 Share
          </button>
          <button className="btn glass" style={{ borderRadius: '24px', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--coral)' }}>
            🤍 Save
          </button>
        </div>
      </div>

      {/* 5-Photo Editorial Bento Grid */}
      <div className="photo-bento-grid mb-4" onClick={() => setIsGalleryOpen(true)} style={{ cursor: 'pointer' }}>
        <div className="bento-main">
          <img src={property.image} alt={property.title} />
        </div>
        <div className="bento-side">
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" alt="Living Room" />
        </div>
        <div className="bento-side">
          <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80" alt="Solar Setup" />
        </div>
        <div className="bento-side">
          <img src="https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80" alt="Solar Inverter" />
        </div>
        <div className="bento-side" style={{ position: 'relative' }}>
          <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80" alt="Bedroom Suite" />
          <div className="bento-view-all-overlay">
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>+4 Photos</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>View Gallery</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '2.5rem', alignItems: 'start' }}>
        {/* Left Column (60%): Story, Telemetry, and Scout Verifications */}
        <div>
          {/* Host Byline */}
          <div className="glass p-4 mb-4 d-flex justify-between align-center" style={{ borderRadius: '20px' }}>
            <div className="d-flex align-center gap-3">
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--teal), var(--teal-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>
                FL
              </div>
              <div>
                <h4 style={{ margin: 0, color: 'var(--teal)', fontSize: '1.1rem' }}>Managed by Flex-Living Host Team</h4>
                <span className="text-xs text-secondary">Verified Host • 2-Year Escrow Guaranteed</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--gold-dark)', fontWeight: 800, fontSize: '1.15rem' }}>⭐ {property.rating}</div>
              <span className="text-xs text-secondary">Super-Host Verified</span>
            </div>
          </div>

          {/* Property Description */}
          <div className="glass p-4 mb-4" style={{ borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--teal)', marginBottom: '0.75rem' }}>About this Property</h3>
            <p style={{ lineHeight: 1.8, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{property.description}</p>
          </div>

          {/* Flex-Trust Field Scout Full Report Card (Controllable by FLAG_200_POINT_TELEMETRY) */}
          {flags.FLAG_200_POINT_TELEMETRY !== false && (
            <div className="glass mb-4" style={{ borderRadius: '20px', padding: '1.75rem', border: '1px solid rgba(16,185,129,0.3)' }}>
              <div className="d-flex justify-between align-center mb-3">
                <h3 style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--teal)' }}>
                  <span>🛡️</span> Flex-Trust Field Scout Verification
                </h3>
                <span className="badge badge-verified" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                  100% Audit Score
                </span>
              </div>
              <p className="text-sm text-secondary mb-4">
                Physically verified on-site in {property.city} by Lead Scout <strong>{property.scout}</strong>.
              </p>

              {flags.FLAG_VERIFIED_BADGES !== false && (
                <div className="d-flex gap-2 mb-4" style={{ flexWrap: 'wrap' }}>
                  {property.badges.map(b => <Badge key={b} type={b} />)}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: '16px' }}>
                  <div className="text-secondary text-xs font-bold mb-1">⚡ Automatic Transfer Switch</div>
                  <div className="font-bold text-teal" style={{ fontSize: '1.15rem' }}>&lt; 8 seconds switchover</div>
                  <p className="text-xs text-secondary mt-1">Solar inverter + generator load tested</p>
                </div>

                <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: '16px' }}>
                  <div className="text-secondary text-xs font-bold mb-1">🌐 Ookla Speedtest</div>
                  <div className="font-bold text-teal" style={{ fontSize: '1.15rem' }}>180 Mbps / 24ms</div>
                  <p className="text-xs text-secondary mt-1">UPS backed • 0 packet loss</p>
                </div>

                <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: '16px' }}>
                  <div className="text-secondary text-xs font-bold mb-1">💧 Water Autonomy</div>
                  <div className="font-bold text-teal" style={{ fontSize: '1.15rem' }}>Borehole + 5,000L Tank</div>
                  <p className="text-xs text-secondary mt-1">3-stage carbon filtration verified</p>
                </div>

                <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: '16px' }}>
                  <div className="text-secondary text-xs font-bold mb-1">🔊 Noise Floor Level</div>
                  <div className="font-bold text-teal" style={{ fontSize: '1.15rem' }}>38 dB (Quiet & Calm)</div>
                  <p className="text-xs text-secondary mt-1">Acoustic insulation sound tested</p>
                </div>
              </div>
            </div>
          )}

          {/* 99.5% SLA Guarantee Card (Controllable by FLAG_SLA_2HR_CURE_TIMER) */}
          {flags.FLAG_SLA_2HR_CURE_TIMER !== false && (
            <div className="glass-dark mb-4" style={{ borderRadius: '20px', padding: '1.75rem' }}>
              <div className="d-flex align-center gap-3 mb-3">
                <span style={{ fontSize: '2rem' }}>⚡</span>
                <div>
                  <h3 style={{ color: 'white', margin: 0, fontSize: '1.3rem' }}>Flex-Stay 99.5% Uptime SLA Guarantee</h3>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)', margin: '2px 0 0 0' }}>Automated Smart Contract & Escrow Protection</p>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                If grid power and backup systems fail for &gt; 2 hours, Flex-Living automatically transfers a compensation credit from the host's escrow and books you into a partner co-working hub. Zero disputes.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '12px', fontSize: '0.85rem' }}>
                  ✓ Guaranteed $35/hr Outage Credit
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '12px', fontSize: '0.85rem' }}>
                  ✓ Instant Relocation Voucher
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (40%): Sticky Booking & Flex-Advance Widget */}
        <div>
          <div className="glass-dark p-4" style={{ borderRadius: '24px', position: 'sticky', top: '100px', boxShadow: '0 16px 40px rgba(0,0,0,0.2)' }}>
            <div className="d-flex justify-between align-center mb-3">
              <div>
                <span className="text-xs" style={{ opacity: 0.8 }}>Verified Monthly Rate</span>
                <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--coral)' }}>
                  {formatPrice(property.price)}
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}> / month</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--gold)', fontWeight: 800, fontSize: '1.1rem' }}>⭐ {property.rating}</div>
                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>42 Verified Reviews</span>
              </div>
            </div>

            <hr style={{ borderColor: 'rgba(255,255,255,0.15)', margin: '1.25rem 0' }} />

            {/* Flex-Advance Interactive Feature Box */}
            <div style={{ background: 'rgba(233,69,96,0.18)', border: '1px solid rgba(233,69,96,0.4)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div className="d-flex justify-between align-center mb-2">
                <div style={{ fontWeight: 800, color: 'var(--coral-light)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🚀</span> Eligible for Flex-Advance
                </div>
                <span className="badge badge-verified" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>Prime 1.5%</span>
              </div>
              <p style={{ fontSize: '0.85rem', opacity: 0.9, lineHeight: 1.4, marginBottom: '1rem' }}>
                Avoid paying {currency === 'USD' ? '$7,680' : 'GHS 96,000'} upfront for a 2-year lease. Pay monthly with employer payroll deduction.
              </p>
              <button
                onClick={() => setIsCalcOpen(true)}
                className="btn w-100"
                style={{
                  background: 'white',
                  color: 'var(--coral)',
                  border: 'none',
                  padding: '8px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >
                📊 Calculate Cash Flow Savings
              </button>
            </div>

            {/* Escrow Guarantee Pill */}
            <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '14px', padding: '1rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>🛡️</span>
              <div style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
                <strong>15% Host Escrow Hold:</strong> Your funds are released to host only after confirmed uptime.
              </div>
            </div>

            <button 
              className="btn btn-primary w-100" 
              style={{ padding: '1.15rem', fontSize: '1.15rem', fontWeight: 800, borderRadius: '14px', boxShadow: '0 6px 20px rgba(233,69,96,0.4)' }}
              onClick={onBook}
            >
              Reserve with Flex-Advance →
            </button>

            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', opacity: 0.7 }}>
              🔒 Bank-Grade Security • Paystack & Card Supported
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
