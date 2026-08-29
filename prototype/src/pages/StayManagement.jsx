import React, { useState, useEffect } from 'react';

export default function StayManagement({ property, onBack }) {
  const [outageState, setOutageState] = useState('IDLE'); // IDLE, DIAGNOSING, DIAGNOSED, RELOCATING
  const [cureTimer, setCureTimer] = useState(7200); // 2 hours in seconds

  useEffect(() => {
    let interval = null;
    if (outageState === 'DIAGNOSED' && cureTimer > 0) {
      interval = setInterval(() => {
        setCureTimer(prev => prev - 1);
      }, 1000);
    } else if (cureTimer === 0 && outageState === 'DIAGNOSED') {
      setOutageState('RELOCATING');
    }
    return () => clearInterval(interval);
  }, [outageState, cureTimer]);

  const reportOutage = () => {
    setOutageState('DIAGNOSING');
    setTimeout(() => {
      setOutageState('DIAGNOSED');
    }, 3000); // Simulate diagnostic time
  };

  const fastForward = () => {
    setCureTimer(0);
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="screen-container">
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        <div className="d-flex align-center gap-3 mb-4">
          <button 
            onClick={onBack}
            className="btn glass"
            style={{ width: '40px', height: '40px', borderRadius: '50%', padding: 0, fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--teal)' }}
          >
            ←
          </button>
          <div>
            <span className="text-secondary text-xs">Active Stay Management • 99.5% SLA Guarantee</span>
            <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--teal)' }}>Active Stay Resolution Hub</h2>
          </div>
        </div>

      <div className="property-card" style={{ marginBottom: '2rem' }}>
        <img src={property.image} alt={property.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
        <div style={{ padding: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{property.title}</h3>
          <p className="text-sm text-secondary">Check-in: Aug 25 • 3 Months</p>
        </div>
      </div>

      <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Flex-Stay Management</h3>

      {outageState === 'IDLE' && (
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔌</div>
          <h4 style={{ marginBottom: '0.5rem', color: 'var(--teal)' }}>Experiencing an Issue?</h4>
          <p className="text-sm text-secondary mb-4">Power or internet down? Tap below to run automated diagnostics.</p>
          <button className="btn btn-primary w-100" onClick={reportOutage}>
            Report Outage
          </button>
        </div>
      )}

      {outageState === 'DIAGNOSING' && (
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px', textAlign: 'center' }}>
          <div className="mb-4" style={{ animation: 'pulse 1.5s infinite' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--coral)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem' }}>
              📡
            </div>
          </div>
          <h4 style={{ color: 'var(--teal)', marginBottom: '0.5rem' }}>Running Diagnostics...</h4>
          <p className="text-sm text-secondary">Pinging IoT Smart Plug and Edge Router.</p>
        </div>
      )}

      {outageState === 'DIAGNOSED' && (
        <div className="glass-dark" style={{ padding: '1.5rem', borderRadius: '16px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--error)' }}>⚠️</span>
            <h4 style={{ color: 'white', margin: 0 }}>Critical Outage Confirmed</h4>
          </div>
          <p className="text-sm mb-4" style={{ opacity: 0.9 }}>
            Grid power lost. Generator switchover failed. Host has been notified.
          </p>
          
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', textAlign: 'center', marginBottom: '1rem' }}>
            <div className="text-xs mb-1" style={{ opacity: 0.8 }}>Host Cure Timer</div>
            <div className="font-display font-bold" style={{ fontSize: '2rem', color: 'var(--coral)' }}>
              {formatTime(cureTimer)}
            </div>
          </div>

          <p className="text-xs mb-4" style={{ opacity: 0.8, textAlign: 'center' }}>
            If the issue is not resolved when the timer expires, you will receive a 100% refund of unused nights and free relocation.
          </p>

          <button className="btn btn-outline w-100" style={{ borderColor: 'white', color: 'white' }} onClick={fastForward}>
            Fast-Forward Timer (Demo)
          </button>
        </div>
      )}

      {outageState === 'RELOCATING' && (
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', border: '2px solid var(--coral)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>🚀</div>
          <h4 style={{ color: 'var(--coral)', textAlign: 'center', marginBottom: '0.5rem' }}>SLA Breach Triggered</h4>
          <p className="text-sm text-center text-secondary mb-4">
            The host failed to cure the outage within 2 hours. Your escrow has been partially refunded.
          </p>
          <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <div className="d-flex justify-between mb-2">
              <span className="text-sm font-bold text-teal">Refund Issued:</span>
              <span className="text-sm font-bold text-teal">GHS 3,500</span>
            </div>
            <div className="d-flex justify-between">
              <span className="text-sm text-secondary">Host Penalty:</span>
              <span className="text-sm text-secondary">Badge Downgraded</span>
            </div>
          </div>
          <button className="btn btn-primary w-100">
            1-Tap Relocation &rarr;
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
