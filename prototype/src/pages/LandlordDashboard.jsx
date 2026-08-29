import React, { useState, useEffect } from 'react';

export default function LandlordDashboard() {
  const [telemetry, setTelemetry] = useState({
    powerStatus: 'GRID',
    voltage: 230,
    routerOnline: true,
    downloadSpeed: 120,
    uploadSpeed: 50
  });

  // Simulate some live fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        voltage: 220 + Math.floor(Math.random() * 20),
        downloadSpeed: 110 + Math.floor(Math.random() * 20)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="screen-container">
      <div className="d-flex justify-between align-center mb-4">
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Host Dashboard</h2>
          <p className="text-secondary text-sm">Welcome back, Kofi</p>
        </div>
        <div style={{ background: 'var(--success)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
          0 Strikes
        </div>
      </div>

      {/* Financial Stats */}
      <div className="d-flex gap-3 mb-4">
        <div className="glass" style={{ flex: 1, padding: '1rem', borderRadius: '12px' }}>
          <div className="text-xs text-secondary mb-1">Escrow Holding</div>
          <div className="font-bold text-teal" style={{ fontSize: '1.25rem' }}>GHS 12,000</div>
        </div>
        <div className="glass" style={{ flex: 1, padding: '1rem', borderRadius: '12px' }}>
          <div className="text-xs text-secondary mb-1">Next Payout</div>
          <div className="font-bold text-teal" style={{ fontSize: '1.25rem' }}>GHS 4,000</div>
        </div>
      </div>

      {/* IoT Telemetry */}
      <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Live IoT Telemetry</h3>
      
      <div className="glass-dark mb-4" style={{ borderRadius: '16px', padding: '1.5rem' }}>
        <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span role="img" aria-label="bolt">⚡</span> Power Status
        </h4>
        <div className="d-flex justify-between align-center mb-3">
          <span className="text-sm" style={{ opacity: 0.8 }}>Source</span>
          <span className="badge badge-power">{telemetry.powerStatus}</span>
        </div>
        <div className="d-flex justify-between align-center mb-3">
          <span className="text-sm" style={{ opacity: 0.8 }}>Smart Plug Voltage</span>
          <span className="font-display font-bold">{telemetry.voltage}V</span>
        </div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${(telemetry.voltage / 250) * 100}%`, height: '100%', background: 'var(--gold)', transition: 'width 0.5s ease' }}></div>
        </div>
      </div>

      <div className="glass mb-4" style={{ borderRadius: '16px', padding: '1.5rem', background: 'white' }}>
        <h4 style={{ color: 'var(--teal)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span role="img" aria-label="wifi">🌐</span> Internet Edge Test
        </h4>
        <div className="d-flex justify-between align-center mb-3">
          <span className="text-sm text-secondary">Router Status</span>
          <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '0.875rem' }}>● Online (UPS Backed)</span>
        </div>
        <div className="d-flex justify-between align-center mb-2">
          <span className="text-sm text-secondary">Download</span>
          <span className="font-display font-bold text-teal">{telemetry.downloadSpeed} Mbps</span>
        </div>
        <div className="d-flex justify-between align-center">
          <span className="text-sm text-secondary">Upload</span>
          <span className="font-display font-bold text-teal">{telemetry.uploadSpeed} Mbps</span>
        </div>
      </div>

      {/* SLA Dispute Alert */}
      <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Active Claims</h3>
      <div className="glass" style={{ borderRadius: '12px', padding: '1.25rem', borderLeft: '4px solid var(--success)' }}>
        <p className="text-sm font-bold text-teal m-0">No active SLA disputes.</p>
        <p className="text-xs text-secondary mt-1">Your properties are performing flawlessly.</p>
      </div>
    </div>
  );
}
