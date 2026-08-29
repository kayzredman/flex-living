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
      {/* Host Header */}
      <div className="d-flex justify-between align-center mb-4" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="text-secondary text-xs">Host Portal & Asset Management</span>
          <h2 style={{ fontSize: '1.75rem', margin: 0, color: 'var(--teal)' }}>Host Infrastructure Command</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.3)', padding: '0.4rem 0.85rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
            ● 3 Properties Online
          </div>
          <div style={{ background: 'var(--teal)', color: 'white', padding: '0.4rem 0.85rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
            0 SLA Strikes
          </div>
        </div>
      </div>

      {/* 4-Card Responsive KPI Financial Grid */}
      <div className="dashboard-stats-grid mb-4">
        <div className="glass" style={{ padding: '1.25rem', borderRadius: '16px' }}>
          <div className="text-xs text-secondary mb-1">15% SLA Escrow Reserve</div>
          <div className="font-bold text-teal" style={{ fontSize: '1.5rem', color: 'var(--teal)' }}>GHS 12,000</div>
          <div className="text-xs" style={{ color: 'var(--success)', marginTop: '4px' }}>✓ 100% Protected</div>
        </div>
        <div className="glass" style={{ padding: '1.25rem', borderRadius: '16px' }}>
          <div className="text-xs text-secondary mb-1">Next Payout (3 Days)</div>
          <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--coral)' }}>GHS 24,500</div>
          <div className="text-xs text-secondary" style={{ marginTop: '4px' }}>Bank Transfer (Ecobank)</div>
        </div>
        <div className="glass" style={{ padding: '1.25rem', borderRadius: '16px' }}>
          <div className="text-xs text-secondary mb-1">30-Day SLA Uptime</div>
          <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--success)' }}>99.8%</div>
          <div className="text-xs text-secondary" style={{ marginTop: '4px' }}>Across Cantonments & Osu</div>
        </div>
        <div className="glass" style={{ padding: '1.25rem', borderRadius: '16px' }}>
          <div className="text-xs text-secondary mb-1">Flex-Trust Badges</div>
          <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--gold-dark)' }}>4 Verified</div>
          <div className="text-xs text-secondary" style={{ marginTop: '4px' }}>Solar, Starlink, Borehole, Lock</div>
        </div>
      </div>

      {/* 2-Column Responsive Telemetry & SLA Operations Grid */}
      <div className="dashboard-main-grid">
        {/* Left Column: Live IoT Telemetry */}
        <div>
          <div className="glass-dark p-4 mb-4" style={{ borderRadius: '20px' }}>
            <div className="d-flex justify-between align-center mb-4">
              <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
                <span role="img" aria-label="bolt">⚡</span> Cantonments Villa: Power Telemetry
              </h4>
              <span className="badge badge-power" style={{ background: 'var(--coral)', color: 'white' }}>
                LIVE FEED
              </span>
            </div>

            <div className="d-flex justify-between align-center mb-3">
              <span className="text-sm" style={{ opacity: 0.8 }}>Current Source</span>
              <span style={{ fontWeight: 'bold', color: 'var(--gold-light)' }}>ECG Grid + Solar Hybrid</span>
            </div>

            <div className="d-flex justify-between align-center mb-2">
              <span className="text-sm" style={{ opacity: 0.8 }}>Smart Plug Meter Voltage</span>
              <span className="font-display font-bold" style={{ fontSize: '1.4rem', color: 'white' }}>
                {telemetry.voltage} V <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>● Stable</span>
              </span>
            </div>

            <div style={{ height: '6px', background: 'rgba(255,255,255,0.15)', borderRadius: '3px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <div style={{ width: `${(telemetry.voltage / 250) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--gold), var(--coral))', transition: 'width 0.5s ease' }}></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(255,255,255,0.06)', padding: '1rem', borderRadius: '12px' }}>
              <div>
                <span className="text-xs" style={{ opacity: 0.7 }}>Backup Generator</span>
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Auto-Standby (Diesel Full)</div>
              </div>
              <div>
                <span className="text-xs" style={{ opacity: 0.7 }}>ATS Switch Time</span>
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--success)' }}>&lt; 8 seconds</div>
              </div>
            </div>
          </div>

          {/* Caretaker WhatsApp Pulse Check Card */}
          <div className="glass p-4" style={{ borderRadius: '20px' }}>
            <h4 style={{ color: 'var(--teal)', margin: 0, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📱</span> Caretaker Daily WhatsApp Pulse Check
            </h4>
            <div className="d-flex justify-between align-center mb-2">
              <span className="text-sm text-secondary">Reported By:</span>
              <span className="text-sm font-bold text-teal">Kofi Mensah (+233 55 123 4999)</span>
            </div>
            <div className="d-flex justify-between align-center mb-2">
              <span className="text-sm text-secondary">Today at 08:00 AM:</span>
              <span className="badge badge-verified">✓ ECG Normal • Tank 100% • Diesel Ready</span>
            </div>
            <p className="text-xs text-secondary m-0">
              Low-tech fallback active. Caretaker confirms physical equipment daily via WhatsApp bot.
            </p>
          </div>
        </div>

        {/* Right Column: Internet Edge Test & Claims */}
        <div>
          <div className="glass p-4 mb-4" style={{ borderRadius: '20px', background: 'white' }}>
            <h4 style={{ color: 'var(--teal)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
              <span role="img" aria-label="wifi">🌐</span> Internet Edge QoS (Starlink + Fibre)
            </h4>
            <div className="d-flex justify-between align-center mb-3">
              <span className="text-sm text-secondary">Router Status</span>
              <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '0.875rem' }}>● Online (UPS Backed)</span>
            </div>
            <div className="d-flex justify-between align-center mb-2">
              <span className="text-sm text-secondary">Real-time Download</span>
              <span className="font-display font-bold text-teal" style={{ fontSize: '1.25rem' }}>{telemetry.downloadSpeed} Mbps</span>
            </div>
            <div className="d-flex justify-between align-center mb-3">
              <span className="text-sm text-secondary">Real-time Upload</span>
              <span className="font-display font-bold text-teal" style={{ fontSize: '1.25rem' }}>{telemetry.uploadSpeed} Mbps</span>
            </div>
            <div className="d-flex justify-between align-center" style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
              <span className="text-xs text-secondary">Latency / Jitter:</span>
              <span className="text-xs font-bold text-teal">24ms (Gaming & Zoom Certified)</span>
            </div>
          </div>

          {/* Active SLA Disputes Card */}
          <div className="glass p-4" style={{ borderRadius: '20px', borderLeft: '5px solid var(--success)' }}>
            <h4 style={{ color: 'var(--teal)', margin: 0, marginBottom: '0.5rem' }}>Active SLA Outage Claims</h4>
            <p className="text-sm font-bold text-teal m-0">No active SLA disputes.</p>
            <p className="text-xs text-secondary mt-1">
              Your 99.5% uptime guarantee is healthy. Full escrow will be released on schedule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
